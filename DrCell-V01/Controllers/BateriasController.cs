using DrCell_V01.Data;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BateriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IBateriasService _bateriasService;
        public BateriasController(ApplicationDbContext context, IBateriasService bateriasService)
        {
            _context = context;
            _bateriasService = bateriasService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBaterias()
        {
            try
            {
                var baterias= await _bateriasService.ObtenerBateriasAsync();
                return Ok(baterias);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener las baterias", error = ex.Message });
            }
        }
        [HttpGet("marca/{marca}")]
        public async Task<IActionResult> GetBateriasByMarca(string marca)
        {
            try
            {
                var marcas = await _bateriasService.ObtenerBateriasByMarcaAsync(marca);
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
                var baterias = await _bateriasService.ObtenerBateriasByModeloAsync();
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
                var modulo = await _bateriasService.ObtenerBateriasByModeloYMarcaAsync(marca, modelo);

                return Ok(modulo);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener las baterias por marca y modelo", error = ex.Message });
            }
        }
    }
}
