using DrCell_V01.Data;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ModulosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICelularesService _celularesService;
        public ModulosController(ApplicationDbContext context, ICelularesService celularesService)
        {
            _context = context;
            _celularesService = celularesService;
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
