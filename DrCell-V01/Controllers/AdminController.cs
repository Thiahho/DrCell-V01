using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IUsuarioService _usuarioService;
        private readonly ICelularesService _celularesService;
        public AdminController(ApplicationDbContext context, IConfiguration config, IUsuarioService usuarioService, ICelularesService equiposService)
        {
            _context = context;
            _configuration = config;
            _usuarioService = usuarioService;
            _celularesService = equiposService;
        }

        [HttpPost("registro")]
        public async Task<IActionResult> CrearAdminDesdePostman([FromBody] Usuario usuario)
        {
            try
            {
                if (usuario.Rol?.ToUpper() != "ADMIN")
                    return BadRequest("Este endpoint solo acepta usuarios con rol ADMIN.");

                // Hash de la clave antes de guardar
                usuario.ClaveHash = BCrypt.Net.BCrypt.HashPassword(usuario.ClaveHash);

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return Ok("Administrador creado correctamente.");
            }
            catch (Exception)
            {
                return StatusCode(500, "Error al crear el administrador.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Auth auth)
        {
         var usuario = await _usuarioService.ValidarCredencialesAsync(auth.Email, auth.Password);
            if (usuario == null)
            {
                return Unauthorized("Credenciales inválidas.");
            }
            var token = _usuarioService.GenerarToken(usuario);
            
            return Ok(new 
            {
                Token = token,
                Usuario = new
                {
                    usuario.Id,
                    usuario.Email,
                    usuario.Rol
                }
            });
        }

        private async Task<bool> AlreadyExist(string email)
        {
            return await _context.Usuarios.AnyAsync(u=>u.Email.ToLower()== email.ToLower());
        }

        // ============================= ENDPOINTS PROTEGIDOS =============================

        [HttpGet]
        public async Task<IActionResult> GetCelulares()
       => Ok(await _celularesService.ObtenerEquiposUnicosAsync());

        [HttpGet("marcas")]
        public async Task<IActionResult> GetMarcas()
            => Ok(await _celularesService.ObtenerMarcasAsync());

        [HttpGet("modelos")]
        public async Task<IActionResult> GetModelos()
            => Ok(await _celularesService.ObtenerModelosAsync());

        [HttpGet("modelos/{marca}")]
        public async Task<IActionResult> GetModelosPorMarca(string marca)
            => Ok(await _celularesService.ObtenerModelosPorMarcaAsync(marca));

        [HttpGet("info/{marca}/{modelo}")]
        public async Task<IActionResult> GetModulosByModelo(string marca, string modelo)
            => Ok(await _celularesService.ObtenerInfoPorMarcaYModeloAsync(marca, modelo));
    }
}
