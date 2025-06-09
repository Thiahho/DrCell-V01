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

        public async Task ActualizarProductoAsync(Productos producto, int id)
        {
            var modelo = await _context.Productos.FindAsync(id);
            if (modelo != null)
            {
                modelo.Marca= producto.Marca;
                modelo.Modelo = producto.Modelo;
                modelo.Categoria = producto.Categoria;
                modelo.Img= producto.Img;
                _context.Productos.Update(modelo);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException("Producto no encontrado.");
            }
        }

       /* public async Task CrearProductoAsync(Productos producto)
        {
            if(producto == null)
            {
                throw new ArgumentNullException(nameof(producto), "El producto no puede ser nulo.");
            }
            var modelo = new Productos
            {
                Marca = producto.Marca,
                Modelo = producto.Modelo,
                Categoria = producto.Categoria,
                Img = producto.Img
            };

            await _context.Productos.AddAsync(modelo);
            await _context.SaveChangesAsync();

            foreach (var variante in producto.Variantes)
            {
                var variant = new ProductosVariantes
                {
                    ProductoId = modelo.Id,
                    Ram = variante.Ram,
                    Almacenamiento = variante.Almacenamiento,
                    Color = variante.Color,
                    Precio = variante.Precio,
                    Stock = variante.Stock
                };
                await _context.ProductosVariantes.AddAsync(variant);
            }
        }*/

        public Task EliminarProducto(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Productos> ObtenerByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<Productos>> ObtenerTodosProductosAsync()
        {
            throw new NotImplementedException();
        }

        public Task CrearVarianteAsync(ProductosVariantes productosVariantes)
        {
            throw new NotImplementedException();
        }

        public Task ActualizarVarianteAsync(ProductosVariantes productosVariantes, int id)
        {
            throw new NotImplementedException();
        }

        public Task EliminarVarianteProducto(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ProductosVariantes> ObtenerVarianteByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProductosVariantes>> ObtenerVariantePorModeloAsync(int idproducto)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProductosVariantes>> ObtenerAllVariantesAsync()
        {
            throw new NotImplementedException();
        }
    }
}

