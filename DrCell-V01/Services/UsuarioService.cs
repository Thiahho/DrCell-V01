using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DrCell_V01.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public UsuarioService(ApplicationDbContext applicationDbContext, IConfiguration configuration)
        {
            _context = applicationDbContext;
            _config = configuration;
        }
        public async Task CrearUsuarioAsync(Usuario usuario)
        {
            if (usuario.Rol != null && usuario.Rol.ToUpper() == "ADMIN")
                throw new InvalidOperationException("No puedes crear usuarios con rol ADMIN desde el sistema.");

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
        }

        public async Task<Usuario> ObtenerUsuarioPorEmailAsync(string email)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email.ToLower());
        }

        public async Task<Usuario> ValidarCredencialesAsync(string userName, string password)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == userName.ToLower());
            if (usuario == null)
            {
                return null; // Usuario no encontrado
            }
            
            bool claveOk= BCrypt.Net.BCrypt.Verify(password, usuario.ClaveHash);

            return claveOk ? usuario : null; // Retorna el usuario si las credenciales son válidas, de lo contrario null
        }

        public string GenerarToken(Usuario usuario)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTKey:Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            
            var token = new JwtSecurityToken(
                issuer: _config["JWTKey:Issuer"],
                audience: _config["JWTKey:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        
    }
}

