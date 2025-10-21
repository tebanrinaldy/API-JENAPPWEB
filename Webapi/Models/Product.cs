namespace Webapi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string name { get; set; }
        public decimal price { get; set; }
        public int categoryId { get; set; }
        public Category category { get; set; }
    }
}
