namespace Webapi.Services
{
    public class TenantProvider : ITenantProvider
    {
        public int? TenantId { get; private set; }
        public string? TenantSlug { get; private set; }

        public void SetTenant(int tenantId, string? tenantSlug = null)
        {
            TenantId = tenantId;
            TenantSlug = tenantSlug;
        }
    }
}
