namespace Webapi.Models
{
    public class InventoryMovement : ITenantScoped
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public string Type { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public string Reason { get; set; } = string.Empty;
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
