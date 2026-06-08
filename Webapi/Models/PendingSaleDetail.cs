using System.Text.Json.Serialization;

namespace Webapi.Models
{
    public class PendingSaleDetail : ITenantScoped
    {
        public int Id { get; set; }
        public int PendingSaleId { get; set; }

        [JsonIgnore]
        public PendingSale? PendingSale { get; set; }

        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
