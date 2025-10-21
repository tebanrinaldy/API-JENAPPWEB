using Microsoft.EntityFrameworkCore;
using Webapi.Models;

namespace Webapi.Data
{
    public class Connectioncontextdb: DbContext
    {
        public Connectioncontextdb(DbContextOptions<Connectioncontextdb> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Webapi.Models.Product> Product { get; set; } = default!;
    }

}
