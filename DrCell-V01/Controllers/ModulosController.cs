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
        private readonly IModulosService _modulosService;
        public ModulosController(ApplicationDbContext context, IModulosService modulosService)
        {
            _context = context;
            _modulosService = modulosService;
        }

        [HttpGet]
        public async Task<IActionResult> GetModulos()
        {
            try
            {
                var modulos = await _modulosService.ObtenerModulosAsync();
                return Ok(modulos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modulos", error = ex.Message });
            }
        }

        [HttpGet("marca/{marca}")]
        public async Task<IActionResult> GetModulosByMarca(string marca)
        {
            try
            {
                var marcas = await _modulosService.ObtenerModulosByMarcaAsync(marca);
                return Ok(marcas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtemer las marcas de los modulos" });
            }
        }
        [HttpGet("modelo/{modelo}")]
        public async Task<IActionResult> GetModulosByModelo(string modelo)
        {
            try
            {
                var modelos= await _modulosService.ObtenerModulosByModeloAsync(modelo);
                return Ok(modelos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modulos", error = ex.Message });
            }
        }

        [HttpGet("Solo-Modulos/{marca}/{modelo}")]
        public async Task<IActionResult> GetModulosByModelo(string marca, string modelo)
        {
            try
            {
                var modulos = await _modulosService.ObtenerModulosByModeloYMarcaAsync(marca, modelo);
                return Ok(modulos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener los modulos por marca y modelo", error = ex.Message });
            }

        }

    }
}
