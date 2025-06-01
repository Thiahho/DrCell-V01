using DrCell_V01.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CelularesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CelularesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCelulares()
        {
            try
            {
                var equipos = await _context.Celulares.
                    Select(e => new
                    {
                        e.marca,
                        e.modelo,
                    }).Distinct().ToListAsync();
                return Ok(equipos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los celulares", error = ex.Message });
            }
        }
        [HttpGet("marcas")]
        public async Task<IActionResult> GetMarcas()
        {
            try
            {
                var marcas = await _context.Celulares.
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
        public async Task<IActionResult> GetModelos()
        {
            try
            {
                var modelos = await _context.Celulares.
                    Select(m => new
                    {
                        m.modelo,
                    }).Distinct().ToListAsync();
                return Ok(modelos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modelos", error = ex.Message });
            }
        }
        [HttpGet("modelos/{marca}")]
        public async Task<IActionResult> GetModelosPorMarca(string marca)
        {
            try
            {
                var modelos = await _context.Celulares
                    .Where(c => c.marca == marca)
                    .Select(m => new { m.modelo })
                    .Distinct()
                    .ToListAsync();
                return Ok(modelos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modelos por marca", error = ex.Message });
            }
        }

      
    }
}
