namespace Webapi.Models
{
    public class PendingSale : ITenantScoped
    {
        public int Id { get; set; }
        public string Client { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string StatusProduct { get; set; } = "Recibido";
        public string TrackingCode { get; set; } = Guid.NewGuid().ToString("N")[..8];
        public DateTime Date { get; set; } = DateTime.Now;
        public decimal Total { get; set; }
        public string Status { get; set; } = "Pendiente";
        public ICollection<PendingSaleDetail> Details { get; set; } = new List<PendingSaleDetail>();
        public int TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
