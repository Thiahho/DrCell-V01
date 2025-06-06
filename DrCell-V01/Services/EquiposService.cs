using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Services
{
    public class EquiposService : ICelularesService
    {
        private readonly ApplicationDbContext _context;

        public EquiposService(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }
        public async Task<List<object>> ObtenerEquiposUnicosAsync()
        {
            return await _context.Celulares
                .AsNoTracking()
                .Select(e => new { e.marca, e.modelo })
                .Distinct()
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<string>> ObtenerMarcasAsync()
        {
            return await _context.Celulares
                .AsNoTracking()
                .Select(m => m.marca)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<string>> ObtenerModelosAsync()
        {
            return await _context.Celulares
                .AsNoTracking()
                .Select(m => m.modelo)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<string>> ObtenerModelosPorMarcaAsync(string marca)
        {
            return await _context.Celulares
                .Where(c => c.marca == marca)
                .Select(m => m.modelo)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerInfoPorMarcaYModeloAsync(string marca, string modelo)
        {
            return await _context.vCelularesMBP
                .Where(c => EF.Functions.ILike(c.marca, marca) && EF.Functions.ILike(c.modelo, modelo))
                .Select(m => new
                {
                    m.marca,
                    m.modelo,
                    m.arreglomodulo,
                    m.arreglobateria,
                    m.arreglopin,
                    m.id
                }).Cast<object>()
                .ToListAsync();
        }

       
    }
}
