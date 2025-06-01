using DrCell_V01.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BateriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BateriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBaterias()
        {
            try
            {
                var baterias= await _context.Baterias.
                    Select(b => new
                    {
                        b.id,
                        b.marca,
                        b.modelo,
                        b.costo,
                        b.arreglo

                    }).ToListAsync();
                return Ok(baterias);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener las baterias", error = ex.Message });
            }
        }
        [HttpGet("marca")]
        public async Task<IActionResult> GetBateriasByMarca()
        {
            try
            {
                var marcas = await _context.Baterias.
                    Select(m => new
                    {
                        m.id,
                        m.marca,
                    }).ToListAsync();
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los marcas de baterias", error = ex.Message });
            }
        }
        [HttpGet("modelos")]
        public async Task<IActionResult> GetBateriasByModelos()
        {
            try
            {
                var baterias= await _context.Baterias.
                    Select(b => new
                    {
                        b.id,
                        b.modelo,
                    }).ToListAsync();
                return Ok(baterias);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los baterias", error = ex.Message });
            }
        }
        [HttpGet("Solo-Baterias/{marca}/{modelo}")]
        public async Task<IActionResult> GetBateriaByModelo(string marca, string modelo)
        {
            try
            {
                var modulo = await _context.vCelularB
                    .Where(c => EF.Functions.ILike(c.marca, marca) &&
                                EF.Functions.ILike(c.modelo, modelo))
                     .Select(m => new {
                         m.marca,
                         m.modelo,
                         m.tipo,
                         m.arreglobateria
                     }).ToListAsync();

                return Ok(modulo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener las baterias por marca y modelo", error = ex.Message });
            }
        }
    }
}
