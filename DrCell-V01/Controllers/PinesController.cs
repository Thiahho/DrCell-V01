using DrCell_V01.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PinesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPines()
        {
            try
            {
                var pines= await _context.Pines.
                    Select(b => new
                    {
                        b.id,
                        b.marca,
                        b.modelo,
                        b.costo,
                        b.arreglo

                    }).ToListAsync();
                return Ok(pines);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los pines", error = ex.Message });
            }
        }
        [HttpGet("marca")]
        public async Task<IActionResult> GetPinesByMarca()
        {
            try
            {
                var marcas = await _context.Pines.
                    Select(m => new
                    {
                        m.id,
                        m.marca,
                    }).ToListAsync();
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los marcas de los pines", error = ex.Message });
            }
        }
        [HttpGet("modelos")]
        public async Task<IActionResult> GetPinesByModelos()
        {
            try
            {
                var pines= await _context.Pines.
                    Select(b => new
                    {
                        b.id,
                        b.modelo,
                    }).ToListAsync();
                return Ok(pines);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los pines", error = ex.Message });
            }
        }
        [HttpGet("Solo-Pines/{marca}/{modelo}")]
        public async Task<IActionResult> GetPinesByModelo(string marca, string modelo)
        {
            try
            {
                var pines = await _context.vCelularP
                    .Where(c => EF.Functions.ILike(c.marca, marca) &&
                                EF.Functions.ILike(c.modelo, modelo))
                     .Select(m => new {
                         m.marca,
                         m.modelo,
                         m.arreglopin
                     }).ToListAsync();

                return Ok(pines);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los pines por marca y modelo", error = ex.Message });
            }
        }
    }
}
