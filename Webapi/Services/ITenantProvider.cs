namespace Webapi.Services
{
    public interface ITenantProvider
    {
        int? TenantId { get; }
        string? TenantSlug { get; }
        void SetTenant(int tenantId, string? tenantSlug = null);
    }
}
