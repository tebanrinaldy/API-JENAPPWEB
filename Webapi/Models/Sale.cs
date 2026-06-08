namespace Webapi.Models
{
    public class Sale : ITenantScoped
    {
        public int Id { get; set; }
        public string Client { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.Now;
        public decimal Total { get; set; }
        public ICollection<SaleDetail> Details { get; set; } = new List<SaleDetail>();
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
