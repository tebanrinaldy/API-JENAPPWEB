using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Webapi
{
    public class JwtTokensGenerator
    {
        private readonly IConfiguration _config; 

        public JwtTokensGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(UserTokenData user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim("tenant_id", user.TenantId.ToString()),
                new Claim("tenant_slug", user.TenantSlug)
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],               
                audience: _config["JwtSettings:Audience"],           
                claims: claims,                                      
                expires: DateTime.UtcNow.AddMinutes(                 
                    double.Parse(_config["JwtSettings:ExpiresInMinutes"]!)
                ),
                signingCredentials: new SigningCredentials(          
                    new SymmetricSecurityKey(key),                   
                    SecurityAlgorithms.HmacSha256                  
                )
            );

            // 4️⃣ Convertir el objeto token a texto
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public record UserTokenData(int UserId, string Username, int TenantId, string TenantSlug);
    }
}
