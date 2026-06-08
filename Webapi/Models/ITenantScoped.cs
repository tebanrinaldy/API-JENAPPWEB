namespace Webapi.Models
{
    public interface ITenantScoped
    {
        int TenantId { get; set; }
    }
}
