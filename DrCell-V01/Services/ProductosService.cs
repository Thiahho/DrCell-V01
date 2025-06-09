using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Services
{
    public class ProductosService : IProductoService
    {
        private readonly ApplicationDbContext _context;
        public ProductosService(ApplicationDbContext applicationDbContext)

        {
            _context = applicationDbContext;
        }

        public async Task<Productos> AddAsync(Productos productos)
        {
            _context.Productos.Add(productos);
            await _context.SaveChangesAsync();  
            return productos;
        }

        public async Task<ProductosVariantes> AddVarianteAsync(ProductosVariantes productosVariantes)
        {
            _context.ProductosVariantes.Add(productosVariantes);    
            await _context.SaveChangesAsync();
            return productosVariantes;
        }

        public async Task DeleteAsync(int id)
        {
            var producto = _context.Productos.Find(id);
            if (producto != null)
            {
                _context.Productos.Remove(producto);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Productos>> GetAllProductsAsync()
        {
            return await _context.Productos
                .Include(p => p.Variantes)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<Productos>> GetAllVariantesAsync()
        {
            return await _context.Productos
                .Include(p => p.Variantes)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Productos> GetByIdWithVarianteAsync(int id)
        {
            return await _context.Productos
                .Include(p => p.Variantes)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
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

        public async Task<IEnumerable<ProductosVariantes>> GetVariantesByIdAsync(int productId)
        {
            return await _context.ProductosVariantes
                .Where(v => v.ProductoId == productId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ProductosVariantes> GetVarianteSpecAsync(int productId, string ram, string storage, string color, string condicion)
        {
            return await _context.ProductosVariantes
                .Where(v => v.ProductoId == productId)
                .Where(v => v.Ram == ram)
                .Where(v => v.Almacenamiento== storage)
                .Where(v => v.Color == color)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Productos productos)
        {
            _context.Entry(productos).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
