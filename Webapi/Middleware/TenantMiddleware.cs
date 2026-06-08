using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Services;

namespace Webapi.Middleware
{
    public class TenantMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<TenantMiddleware> _logger;

        public TenantMiddleware(RequestDelegate next, ILogger<TenantMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(
            HttpContext httpContext,
            ITenantProvider tenantProvider,
            Connectioncontextdb db)
        {
            var tenantIdClaim = httpContext.User.FindFirstValue("tenant_id");

            if (int.TryParse(tenantIdClaim, out var tenantId))
            {
                _logger.LogInformation($"Tenant from JWT claim: {tenantId}");
                tenantProvider.SetTenant(tenantId);
                await _next(httpContext);
                return;
            }

            var slug = httpContext.Request.Headers["X-Tenant-Slug"].FirstOrDefault()
                ?? httpContext.Request.Query["tenantSlug"].FirstOrDefault();

            _logger.LogInformation($"Extracting tenant slug: '{slug}' from header or query");

            if (!string.IsNullOrWhiteSpace(slug))
            {
                var normalizedSlug = slug.Trim().ToLowerInvariant();
                _logger.LogInformation($"Looking for tenant with slug: {normalizedSlug}");
                
                var tenant = await db.Tenants
                    .IgnoreQueryFilters()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.Slug == normalizedSlug);

                if (tenant != null)
                {
                    _logger.LogInformation($"Found tenant: {tenant.Id} ({tenant.Slug})");
                    tenantProvider.SetTenant(tenant.Id, tenant.Slug);
                }
                else
                {
                    _logger.LogWarning($"Tenant with slug '{normalizedSlug}' not found");
                }
            }
            else
            {
                _logger.LogWarning("No tenant slug provided in request");
            }

            await _next(httpContext);
        }
    }
}
