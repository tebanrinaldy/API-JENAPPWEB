using Microsoft.EntityFrameworkCore;
using Webapi.Models;
using Webapi.Services;

namespace Webapi.Data
{
    public class Connectioncontextdb : DbContext
    {
        private readonly ITenantProvider? _tenantProvider;

        public Connectioncontextdb(
            DbContextOptions<Connectioncontextdb> options,
            ITenantProvider? tenantProvider = null) : base(options)
        {
            _tenantProvider = tenantProvider;
        }

        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleDetail> SaleDetails { get; set; }
        public DbSet<InventoryMovement> InventoryMovement { get; set; } = default!;
        public DbSet<PendingSale> PendingSales { get; set; }
        public DbSet<PendingSaleDetail> PendingSaleDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Tenant>()
                .HasIndex(t => t.Slug)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Sale>().Property(s => s.Total).HasPrecision(18, 2);
            modelBuilder.Entity<SaleDetail>().Property(d => d.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<SaleDetail>().Property(d => d.TotalPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PendingSale>().Property(s => s.Total).HasPrecision(18, 2);
            modelBuilder.Entity<PendingSaleDetail>().Property(d => d.UnitPrice).HasPrecision(18, 2);
            modelBuilder.Entity<PendingSaleDetail>().Property(d => d.TotalPrice).HasPrecision(18, 2);

            modelBuilder.Entity<Category>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<Product>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<Sale>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<SaleDetail>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<InventoryMovement>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<PendingSale>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<PendingSaleDetail>()
                .HasQueryFilter(e => _tenantProvider != null && e.TenantId == _tenantProvider.TenantId);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Tenant)
                .WithMany(t => t.Users)
                .HasForeignKey(u => u.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasOne(c => c.Tenant)
                .WithMany()
                .HasForeignKey(c => c.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Tenant)
                .WithMany()
                .HasForeignKey(p => p.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Sale>()
                .HasOne(s => s.Tenant)
                .WithMany()
                .HasForeignKey(s => s.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SaleDetail>()
                .HasOne(d => d.Tenant)
                .WithMany()
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<InventoryMovement>()
                .HasOne(m => m.Tenant)
                .WithMany()
                .HasForeignKey(m => m.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PendingSale>()
                .HasOne(p => p.Tenant)
                .WithMany()
                .HasForeignKey(p => p.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PendingSaleDetail>()
                .HasOne(d => d.Tenant)
                .WithMany()
                .HasForeignKey(d => d.TenantId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyTenantId();
            return base.SaveChangesAsync(cancellationToken);
        }

        public override int SaveChanges()
        {
            ApplyTenantId();
            return base.SaveChanges();
        }

        private void ApplyTenantId()
        {
            if (_tenantProvider?.TenantId is not int tenantId)
                return;

            foreach (var entry in ChangeTracker.Entries<ITenantScoped>())
            {
                // El tenant siempre se determina en el servidor. Nunca se confía en
                // un TenantId enviado por el cliente al crear información nueva.
                if (entry.State == EntityState.Added)
                    entry.Entity.TenantId = tenantId;
            }
        }
    }
}
