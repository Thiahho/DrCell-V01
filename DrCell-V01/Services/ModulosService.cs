using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Services
{
    public class ModulosService : IModulosService
    {
        private readonly ApplicationDbContext _context;

        public ModulosService(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }
        

        public async Task<List<object>> ObtenerModulosAsync()
        {
            return await _context.Modulos
                .AsNoTracking()
                .Select(m => new {m.marca, m.modelo})
                .Distinct()
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerModulosByMarcaAsync(string marca)
        {
            return await _context.Modulos
                .Where(m => m.marca == marca)
                .Select(m => new
                {
                    m.marca,
                    m.modelo,
                    m.version,
                    m.marco,
                    m.color,
                    m.arreglo,
                }).Cast<object>()
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerModulosByModeloAsync(string modelo)
        {
            return await _context.Modulos
                .Where(c => c.modelo == modelo)
                .Select(m => new
                {
                    m.modelo,
                    m.marca,
                    m.arreglo,
                    m.tipo,
                    m.version,
                    m.marco,
                    m.color,
                }).Cast<object>()
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerModulosByModeloYMarcaAsync(string marca, string modelo)
        {
            return await _context.Modulos
                .Where(m => EF.Functions.ILike(m.marca, marca) && EF.Functions.ILike(m.modelo, modelo))
                .Select(c => new
                {
                    c.marca,
                    c.modelo,
                    c.version,
                    c.marco,
                    c.color,
                    c.arreglo,
                    c.id
                }).Cast<object>()
                .ToListAsync();
        }
    }
}
