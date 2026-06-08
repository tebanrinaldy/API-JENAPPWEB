namespace Webapi.Models
{
    public class Category : ITenantScoped
    {
        public int Id { get; set; }
        public string name { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
