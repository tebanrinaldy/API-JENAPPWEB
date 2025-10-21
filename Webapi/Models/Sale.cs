namespace Webapi.Models
{
    public class Sale
    {
        public int Id { get; set; }
        public String Client { get; set; }
        public string Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;

    }
}
