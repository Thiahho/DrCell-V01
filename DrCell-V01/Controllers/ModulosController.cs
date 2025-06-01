using DrCell_V01.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ModulosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ModulosController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetModulos()
        {
            try
            {
                var modulos= await _context.Modulos.
                    Select(m => new
                    {
                        m.marca,
                        m.modelo,
                        m.costo,
                        m.arreglo,
                        m.color,
                        m.marco,
                        m.version

                    }).ToListAsync();
                return Ok(modulos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modulos", error = ex.Message });
            }
        }
        [HttpGet("marcas")]
        public async Task<IActionResult> GetModulosByMarca()
        {
            try
            {
                var marcas = await _context.Modulos.
                    Select(m => new
                    {
                        m.marca,
                    }).Distinct().ToListAsync();
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los marcas", error = ex.Message });
            }
        }
        [HttpGet("modelos")]
        public async Task<IActionResult> GetModelosByModelos()
        {
            try
            {
                var modelos= await _context.Modulos.
                    Select(m => new
                    {
                        m.modelo,
                    }).ToListAsync();
                return Ok(modelos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modelos", error = ex.Message });
            }
        }
        [HttpGet("Info/{marca}/{modelo}")]
        public async Task<IActionResult> GetModulosByMarcaModelo(string marca, string modelo)
        {
            try
            {
                var modulo = await _context.vCelularesMBP
                    .Where(c => c.marca.ToLower() == marca.ToLower() &&
                           c.modelo.ToLower() == modelo.ToLower())
                     .Select(m => new {
                         m.marca,
                         m.modelo,
                         m.arreglomodulo,
                         m.arreglobateria,
                         m.arreglopin
                     }).ToListAsync();

                return Ok(modulo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modulos por marca y modelo", error = ex.Message });
            }
        }

        [HttpGet("Solo-Modulos/{marca}/{modelo}")]
        public async Task<IActionResult> GetModulosByModelo(string marca, string modelo)
        {
            try
            {
                var modulo = await _context.vCelularM
                    .Where(c => EF.Functions.ILike(c.marca, marca) &&
                                EF.Functions.ILike(c.modelo, modelo))
                     .Select(m => new {
                         m.marca,
                         m.modelo,
                         m.color,
                         m.version,
                         m.marco,
                         m.tipo,
                         m.arreglomodulo
                        
                     }).ToListAsync();

                return Ok(modulo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modulos por marca y modelo", error = ex.Message });
            }
        }
    }
}
