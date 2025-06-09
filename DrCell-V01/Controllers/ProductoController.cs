using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IProductoService _productoService;
        public ProductoController(ApplicationDbContext context, IProductoService productoService)
        {
            _context = context;
           _productoService = productoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Productos>>> GetProductos()
        {
            try
            {
                var productos = await _productoService.GetAllProductsAsync();
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Productos>> GetProductoById(int id)
        {
            try
            {
                var producto = await _productoService.GetByIdWithVarianteAsync(id);
                if (producto == null)
                {
                    return NotFound($"Producto with ID {id} not found.");
                }
                return Ok(producto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{productoId}/variantes")]
        public async Task<ActionResult<IEnumerable<ProductosVariantes>>> GetVariantesAsync(int productoId)
        {
            try
            {
                var variantes = await _productoService.GetVariantesByIdAsync(productoId);
                if (variantes == null || !variantes.Any())
                {
                    return NotFound($"No variants found for Producto with ID {productoId}.");
                }
                return Ok(variantes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{productoId}/Ram-Opciones")]
        public async Task<ActionResult<IEnumerable<string>>> GetDistinctRamAsync(int productoId)
        {
            try
            {
                var producto = await _productoService.GetByIdWithVarianteAsync(productoId);
                if (producto == null)
                {
                    return NotFound($"No hay productos con RAM.");
                }
                var opciones= producto.GetAvailableRAM();
                return Ok(opciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{productoId}/Almacenamiento-Opciones")]
        public async Task<ActionResult<IEnumerable<string>>> GetDistinctAlmacenamientosAsync(int productoId, [FromQuery] string ram)
        {
            try
            {
                var producto= await _productoService.GetByIdWithVarianteAsync(productoId);
                if (producto == null)
                {
                    return NotFound($"No hay opciones de almacenamiento para el producto con ID {productoId} y RAM {ram}.");
                }
                var almacenamientos = producto.GetAvailableStorage(ram);
                return Ok(almacenamientos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{productoId}/Color-Opciones")]
        public async Task<ActionResult<IEnumerable<string>>> GetDistinctColorsAsync(int productoId, [FromQuery] string ram, [FromQuery] string almacenamiento)
        {
            try
            {
                var producto = await _productoService.GetByIdWithVarianteAsync(productoId);
                if (producto == null)
                {
                    return NotFound($"No hay opciones de color para el producto con ID {productoId}, RAM {ram} y almacenamiento {almacenamiento}.");
                }
                var colores = producto.GetAvailableColors(ram, almacenamiento);
                return Ok(colores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{productId}/variante")]
        public async Task<ActionResult<ProductosVariantes>> GetVarianteSpecAsync(int productId, [FromQuery] string ram, [FromQuery] string storage, [FromQuery] string color, [FromQuery] string condicion)
        {
            try
            {
                var variante = await _productoService.GetVarianteSpecAsync(productId, ram, storage, color, condicion);
                if (variante == null)
                {
                    return NotFound($"No se encontró la variante con RAM {ram}, almacenamiento {storage}, color {color} y condición {condicion} para el producto con ID {productId}.");
                }
                return Ok(variante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
