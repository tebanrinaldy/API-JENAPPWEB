using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models;

namespace Webapi.Services
{
    public class Userservice
    {
        private readonly Connectioncontextdb _context;
        private readonly ITenantProvider _tenantProvider;

        public Userservice(Connectioncontextdb context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.Tenant)
                .Where(u => _tenantProvider.TenantId.HasValue && u.TenantId == _tenantProvider.TenantId.Value)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Id == id
                    && _tenantProvider.TenantId.HasValue
                    && u.TenantId == _tenantProvider.TenantId.Value);
        }

        public async Task<string> RegisterUser(User user, string? tenantName = null, string? tenantSlug = null)
        {
            var existingUser = await _context.Users.AnyAsync(u => u.Username == user.Username);
            if (existingUser)
                return "El usuario ya existe";

            if (user.TenantId == 0)
            {
                var existingTenant = await FindTenantAsync(tenantSlug, tenantName);

                if (existingTenant != null)
                {
                    user.TenantId = existingTenant.Id;
                    user.Tenant = existingTenant;
                }
                else
                {
                    var tenant = new Tenant
                    {
                        Name = string.IsNullOrWhiteSpace(tenantName) ? user.Username : tenantName.Trim(),
                        Slug = await BuildAvailableSlugAsync(tenantSlug ?? tenantName ?? user.Username)
                    };

                    _context.Tenants.Add(tenant);
                    user.Tenant = tenant;
                }
            }

            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return "Usuario registrado con éxito";
        }

        public async Task UpdateUserAsync(User user)
        {
            var existing = await GetUserByIdAsync(user.Id);
            if (existing == null)
                throw new KeyNotFoundException("Usuario no encontrado.");

            existing.Username = user.Username;

            if (!string.IsNullOrEmpty(user.Password))
                existing.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User?> ValidateUser(string username, string password)
        {
            var user = await _context.Users
                .Include(u => u.Tenant)
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return null;

            var valid = BCrypt.Net.BCrypt.Verify(password, user.Password);
            return valid ? user : null;
        }

        private async Task<Tenant?> FindTenantAsync(string? tenantSlug, string? tenantName)
        {
            if (!string.IsNullOrWhiteSpace(tenantSlug))
            {
                var normalizedSlug = tenantSlug.Trim().ToLowerInvariant();
                var tenantBySlug = await _context.Tenants
                    .FirstOrDefaultAsync(t => t.Slug.ToLower() == normalizedSlug);

                if (tenantBySlug != null)
                    return tenantBySlug;
            }

            if (!string.IsNullOrWhiteSpace(tenantName))
            {
                var normalizedName = tenantName.Trim().ToLowerInvariant();
                var tenantByName = await _context.Tenants
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == normalizedName);

                if (tenantByName != null)
                    return tenantByName;
            }

            return null;
        }

        private async Task<string> BuildAvailableSlugAsync(string value)
        {
            var baseSlug = Slugify(value);
            var slug = baseSlug;
            var index = 2;

            while (await _context.Tenants.IgnoreQueryFilters().AnyAsync(t => t.Slug == slug))
            {
                slug = $"{baseSlug}-{index}";
                index++;
            }

            return slug;
        }

        private static string Slugify(string value)
        {
            var chars = value.Trim().ToLowerInvariant()
                .Select(c => char.IsLetterOrDigit(c) ? c : '-')
                .ToArray();

            var slug = string.Join("-", new string(chars)
                .Split('-', StringSplitOptions.RemoveEmptyEntries));

            return string.IsNullOrWhiteSpace(slug) ? $"tenant-{Guid.NewGuid():N}"[..15] : slug;
        }
    }
}
