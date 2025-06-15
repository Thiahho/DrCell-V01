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
        private readonly IProductoService _productoService;
        
        public ProductoController(IProductoService productoService)
        {
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
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                    return NotFound($"No se encontró el producto con ID {id}");
                }
                return Ok(producto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                    return NotFound($"No se encontraron variantes para el producto con ID {productoId}");
                }
                return Ok(variantes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                    return NotFound($"No se encontró el producto con ID {productoId}");
                }
                var opciones = producto.GetAvailableRAM();
                return Ok(opciones);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpGet("{productoId}/Almacenamiento-Opciones")]
        public async Task<ActionResult<IEnumerable<string>>> GetDistinctAlmacenamientosAsync(int productoId, [FromQuery] string ram)
        {
            try
            {
                var producto = await _productoService.GetByIdWithVarianteAsync(productoId);
                if (producto == null)
                {
                    return NotFound($"No se encontró el producto con ID {productoId}");
                }
                var almacenamientos = producto.GetAvailableStorage(ram);
                return Ok(almacenamientos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
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
                    return NotFound($"No se encontró el producto con ID {productoId}");
                }
                var colores = producto.GetAvailableColors(ram, almacenamiento);
                return Ok(colores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [AllowAnonymous]
        [HttpGet("{productId}/variante")]
        public async Task<ActionResult<ProductosVariantesDto>> GetVarianteSpecAsync(
            int productId, 
            [FromQuery] string ram, 
            [FromQuery] string storage, 
            [FromQuery] string color)
        {
            try
            {
                var variante = await _productoService.GetVarianteSpecAsync(productId, ram, storage, color);
                if (variante == null)
                {
                    return NotFound($"No se encontró la variante con las especificaciones solicitadas");
                }
                return Ok(variante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<ProductoDto>> CreateProducto([FromBody] ProductoDto producto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Verificar si ya existe un producto con la misma marca y modelo
                var existe = await _productoService.ExistsProductoAsync(producto.Marca, producto.Modelo);
                if (existe)
                {
                    return BadRequest("Ya existe un producto con la misma marca y modelo");
                }

                // Guardar el producto sin variantes primero
                var variantes = producto.Variantes?.ToList() ?? new List<ProductosVariantesDto>();
                producto.Variantes = new List<ProductosVariantesDto>();
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
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Verificar si ya existe una variante con las mismas especificaciones
                var existe = await _productoService.ExistsVarianteAsync(
                    productoId, 
                    variante.Ram, 
                    variante.Almacenamiento, 
                    variante.Color);

                if (existe)
                {
                    return BadRequest("Ya existe una variante con las mismas especificaciones");
                }

                variante.ProductoId = productoId;
                var nuevaVariante = await _productoService.AddVarianteAsync(variante);
                return CreatedAtAction(nameof(GetVarianteSpecAsync), 
                    new { 
                        productId = productoId, 
                        ram = variante.Ram, 
                        storage = variante.Almacenamiento, 
                        color = variante.Color
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
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (id != producto.Id)
                {
                    return BadRequest("El ID del producto no coincide");
                }

                var productoExistente = await _productoService.GetByIdWithVarianteAsync(id);
                if (productoExistente == null)
                {
                    return NotFound($"No se encontró el producto con ID {id}");
                }

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
                {
                    return NotFound($"No se encontró el producto con ID {id}");
                }

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
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var varianteExistente = await _productoService.GetVarianteSpecAsync(
                    productoId, 
                    variante.Ram, 
                    variante.Almacenamiento, 
                    variante.Color);

                if (varianteExistente == null)
                {
                    return NotFound($"No se encontró la variante con ID {varianteId}");
                }

                variante.ProductoId = productoId;
                await _productoService.UpdateVarianteAsync(variante);
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
                var variante = await _productoService.GetVarianteSpecAsync(productoId, "", "", "");
                if (variante == null)
                {
                    return NotFound($"No se encontró la variante con ID {varianteId}");
                }

                await _productoService.DeleteVarianteAsync(varianteId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
