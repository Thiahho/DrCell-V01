using DrCell_V01.Data;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPinesService _pinesService;
        public PinesController(ApplicationDbContext context, IPinesService pinesService)
        {
            _context = context;
            _pinesService = pinesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPines()
        {
            try
            {
                var pines= await _pinesService.ObtenerPinesAsync();
                return Ok(pines);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los pines", error = ex.Message });
            }
        }
        [HttpGet("marca/{marca}")]
        public async Task<IActionResult> GetPinesByMarca(string marca)
        {
            try
            {
                var marcas = await _pinesService.ObtenerPinesByMarcaAsync(marca);
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
                var pines= await _pinesService.ObtenerPinesByModeloAsync();
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
                var pines = await _pinesService.ObtenerPinesByModeloYMarcaAsync(marca, modelo);

                return Ok(pines);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los pines por marca y modelo", error = ex.Message });
            }
        }
    }
}
