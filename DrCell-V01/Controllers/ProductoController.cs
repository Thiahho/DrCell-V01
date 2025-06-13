using DrCell_V01.Data;
using DrCell_V01.Data.Dtos;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

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

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos()
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

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProductoById(int id)
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

        [AllowAnonymous]
        [HttpGet("{productoId}/variantes")]
        public async Task<ActionResult<IEnumerable<ProductosVariantesDto>>> GetVariantesAsync(int productoId)
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

        [AllowAnonymous]
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

        [AllowAnonymous]
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

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpGet("{productId}/variante")]
        public async Task<ActionResult<ProductosVariantesDto>> GetVarianteSpecAsync(int productId, [FromQuery] string ram, [FromQuery] string storage, [FromQuery] string color, [FromQuery] string condicion)
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

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<ProductoDto>> CreateProducto([FromBody] ProductoDto producto)
        {
            try
            {
                if (producto == null)
                    return BadRequest("El producto no puede ser nulo");

                // Guardar el producto sin variantes primero
                var variantes = producto.Variantes?.ToList() ?? new List<ProductosVariantes>();
                producto.Variantes = new List<ProductosVariantes>();
                var nuevoProducto = await _productoService.AddAsync(producto);

                // Si hay variantes, asociarlas y guardarlas
                foreach (var variante in variantes)
                {
                    variante.ProductoId = nuevoProducto.Id;
                    await _productoService.AddVarianteAsync(variante);
                }

                // Recargar el producto con variantes
                var productoConVariantes = await _productoService.GetByIdWithVarianteAsync(nuevoProducto.Id);
                return CreatedAtAction(nameof(GetProductoById), new { id = productoConVariantes.Id }, productoConVariantes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost("{productoId}/variante")]
        public async Task<ActionResult<ProductosVariantesDto>> CreateVariante(int productoId, [FromBody] ProductosVariantesDto variante)
        {
            try
            {
                if (variante == null)
                    return BadRequest("La variante no puede ser nula");

                variante.ProductoId = productoId;
                var nuevaVariante = await _productoService.AddVarianteAsync(variante);
                return CreatedAtAction(nameof(GetVarianteSpecAsync), 
                    new { 
                        productId = productoId, 
                        ram = variante.Ram, 
                        storage = variante.Almacenamiento, 
                        color = variante.Color,
                        stock = variante.Stock
                    }, 
                    nuevaVariante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProducto(int id, [FromBody] ProductoDto producto)
        {
            try
            {
                if (id != producto.Id)
                    return BadRequest("El ID del producto no coincide");

                var productoExistente = await _productoService.GetByIdWithVarianteAsync(id);
                if (productoExistente == null)
                    return NotFound($"No se encontró el producto con ID {id}");

                await _productoService.UpdateAsync(producto);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            try
            {
                var producto = await _productoService.GetByIdWithVarianteAsync(id);
                if (producto == null)
                    return NotFound($"No se encontró el producto con ID {id}");

                await _productoService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{productoId}/variante/{varianteId}")]
        public async Task<IActionResult> UpdateVariante(int productoId, int varianteId, [FromBody] ProductosVariantesDto variante)
        {
            try
            {
                if (varianteId != variante.Id)
                    return BadRequest("El ID de la variante no coincide");

                var varianteExistente = await _productoService.GetVarianteSpecAsync(
                    productoId, 
                    variante.Ram, 
                    variante.Almacenamiento, 
                    variante.Color,
                    "Nuevo" // Asumiendo que es el valor por defecto
                );

                if (varianteExistente == null)
                    return NotFound($"No se encontró la variante con ID {varianteId}");

                _context.Entry(variante).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{productoId}/variante/{varianteId}")]
        public async Task<IActionResult> DeleteVariante(int productoId, int varianteId)
        {
            try
            {
                var variante = await _context.ProductosVariantes
                    .FirstOrDefaultAsync(v => v.Id == varianteId && v.ProductoId == productoId);

                if (variante == null)
                    return NotFound($"No se encontró la variante con ID {varianteId}");

                _context.ProductosVariantes.Remove(variante);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
