using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
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
    [Authorize(Roles = "ADMIN")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Usuario> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;

        public AdminController(ApplicationDbContext context, UserManager<Usuario> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _context = context;
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
        }

        // ============================= REGISTRO ADMIN =============================
        [HttpPost("registro")]
        [AllowAnonymous] // Solo temporal mientras registrás el primer admin
        public async Task<IActionResult> Registro([FromBody] Auth auth)
        {
            if (await AlreadyExist(auth.Email))
                return Unauthorized("ya-existe");

            var user = new Usuario
            {
                UserName = auth.Email,
                Email = auth.Email,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await userManager.CreateAsync(user, auth.Password);
            if (!result.Succeeded)
                return BadRequest("error-registro: " + string.Join(" - ", result.Errors.Select(e => e.Description)));

            if (!await roleManager.RoleExistsAsync("ADMIN"))
                await roleManager.CreateAsync(new IdentityRole("ADMIN"));

            await userManager.AddToRoleAsync(user, "ADMIN");

            return Ok("admin-creado");
        }

        // ============================= LOGIN ADMIN =============================
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] Auth authDTO)
        {
            var user = await userManager.FindByNameAsync(authDTO.Email);
            if (user == null || !await userManager.CheckPasswordAsync(user, authDTO.Password))
                return Unauthorized("credenciales-invalidas");

            var userRoles = await userManager.GetRolesAsync(user);
            if (!userRoles.Contains("ADMIN"))
                return Forbid("no-es-admin");

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in userRoles)
                authClaims.Add(new Claim(ClaimTypes.Role, role));

            string token = CreateToken(authClaims);

            return Ok(new
            {
                token,
                email = user.Email,
                roles = userRoles
            });
        }

        private string CreateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWTKey:Secret"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddHours(Convert.ToDouble(_configuration["JWTKey:TokenExpiryTimeInHour"]));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiration,
                Issuer = _configuration["JWTKey:ValidIssuer"],
                Audience = _configuration["JWTKey:ValidAudience"],
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private async Task<bool> AlreadyExist(string email)
        {
            var user = await userManager.FindByNameAsync(email);
            return user != null;
        }

        // ============================= ENDPOINTS PROTEGIDOS =============================

        [HttpGet]
        public async Task<IActionResult> GetCelulares()
        {
            var equipos = await _context.Celulares
                .Select(e => new { e.marca, e.modelo })
                .Distinct()
                .ToListAsync();
            return Ok(equipos);
        }

        [HttpGet("marcas")]
        public async Task<IActionResult> GetMarcas()
        {
            var marcas = await _context.Celulares
                .Select(m => m.marca)
                .Distinct()
                .ToListAsync();
            return Ok(marcas);
        }

        [HttpGet("modelos")]
        public async Task<IActionResult> GetModelos()
        {
            var modelos = await _context.Celulares
                .Select(m => m.modelo)
                .Distinct()
                .ToListAsync();
            return Ok(modelos);
        }

        [HttpGet("modelos/{marca}")]
        public async Task<IActionResult> GetModelosPorMarca(string marca)
        {
            var modelos = await _context.Celulares
                .Where(c => c.marca == marca)
                .Select(m => m.modelo)
                .Distinct()
                .ToListAsync();
            return Ok(modelos);
        }

        [HttpGet("info/{marca}/{modelo}")]
        public async Task<IActionResult> GetModulosByModelo(string marca, string modelo)
        {
            var modulo = await _context.vCelularesMBP
                .Where(c => EF.Functions.ILike(c.marca, marca) && EF.Functions.ILike(c.modelo, modelo))
                .Select(m => new
                {
                    m.marca,
                    m.modelo,
                    m.arreglomodulo,
                    m.arreglobateria,
                    m.arreglopin,
                    m.celularId
                }).ToListAsync();

            return Ok(modulo);
        }
    }
}
