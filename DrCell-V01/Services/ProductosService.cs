using DrCell_V01.Data;
using DrCell_V01.Data.Dtos;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace DrCell_V01.Services
{
    public class ProductosService : IProductoService
    {   
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        public ProductosService(ApplicationDbContext applicationDbContext, IMapper mapper)
        {
            _context = applicationDbContext;
            _mapper = mapper;
        }

        public async Task<ProductoDto> AddAsync(ProductoDto productoDto)
        {
            var entidad = _mapper.Map<Productos>(productoDto);
            _context.Productos.Add(entidad);
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductoDto>(entidad);
        }

        public async Task<ProductosVariantesDto> AddVarianteAsync(ProductosVariantesDto varianteDto)
        {
            var entidad = _mapper.Map<ProductosVariantes>(varianteDto);
            _context.ProductosVariantes.Add(entidad);    
            await _context.SaveChangesAsync();
            return _mapper.Map<ProductosVariantesDto>(entidad);
        }

        public async Task DeleteAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto != null)
            {
                _context.Productos.Remove(producto);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ProductoDto>> GetAllProductsAsync()
        {
            var productos = await _context.Productos.Include(p => p.Variantes).AsNoTracking().ToListAsync();
            return _mapper.Map<List<ProductoDto>>(productos);
        }

        public async Task<IEnumerable<ProductosVariantesDto>> GetAllVariantesAsync()
        {
            var variantes = await _context.ProductosVariantes.AsNoTracking().ToListAsync();
            return _mapper.Map<List<ProductosVariantesDto>>(variantes);
        }

        public async Task<ProductoDto> GetByIdWithVarianteAsync(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Variantes)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
            return _mapper.Map<ProductoDto>(producto);
        }
            
        public async Task<IEnumerable<string>> GetDistintAlmacenamientosAsync(string ram, int productId)
        {
            return await _context.ProductosVariantes
                .Where(v => v.ProductoId == productId && v.Ram == ram)
                .Select(v => v.Almacenamiento)
                .Where(s => s != null)
                .Distinct()
                .OrderBy(s => s)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetDistintColorAsync(string ram, string almacenamiento, int productId)
        {
            return await _context.ProductosVariantes
                .Where(v => v.ProductoId == productId && v.Ram == ram && v.Almacenamiento == almacenamiento)
                .Select(v => v.Color)
                .Where(c => c != null)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductosVariantesDto>> GetVariantesByIdAsync(int productId)
        {
            var variantes = await _context.ProductosVariantes
                .Where(v => v.ProductoId == productId)
                .AsNoTracking()
                .ToListAsync();
            return _mapper.Map<List<ProductosVariantesDto>>(variantes);
        }

        public async Task<ProductosVariantesDto> GetVarianteSpecAsync(int productId, string ram, string storage, string color, string condicion)
        {
            var variante = await _context.ProductosVariantes
                .Where(v => v.ProductoId == productId)
                .Where(v => v.Ram == ram)
                .Where(v => v.Almacenamiento == storage)
                .Where(v => v.Color == color)
                .AsNoTracking()
                .FirstOrDefaultAsync();
            return _mapper.Map<ProductosVariantesDto>(variante);
        }

        public async Task UpdateAsync(ProductoDto productoDto)
        {
            var entidad = await _context.Productos.Include(p => p.Variantes)
                .FirstOrDefaultAsync(p => p.Id == productoDto.Id);

            if (entidad != null)
            {
                _mapper.Map(productoDto, entidad);
                _context.Productos.Update(entidad);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateVarianteAsync(ProductosVariantesDto varianteDto)
        {
            var entidad = await _context.ProductosVariantes
                .FirstOrDefaultAsync(v => v.Id == varianteDto.Id);

            if (entidad != null)
            {
                _mapper.Map(varianteDto, entidad);
                _context.ProductosVariantes.Update(entidad);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteVarianteAsync(int varianteId)
        {
            var variante = await _context.ProductosVariantes.FindAsync(varianteId);
            if (variante != null)
            {
                _context.ProductosVariantes.Remove(variante);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsVarianteAsync(int productoId, string ram, string almacenamiento, string color)
        {
            return await _context.ProductosVariantes
                .AnyAsync(v => v.ProductoId == productoId && 
                              v.Ram == ram && 
                              v.Almacenamiento == almacenamiento && 
                              v.Color == color);
        }

        public async Task<bool> ExistsProductoAsync(string marca, string modelo)
        {
            return await _context.Productos
                .AnyAsync(p => p.Marca == marca && p.Modelo == modelo);
        }
    }
}
