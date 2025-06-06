using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Services
{
    public class BateriasService : IBateriasService
    {
        private readonly ApplicationDbContext _context;

        public BateriasService(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }

        public async Task<List<object>> ObtenerBateriasAsync()
        {
            return await _context.Baterias
                .AsNoTracking()
                .Select(p => new {p.marca, p.modelo})
                .Distinct()
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerBateriasByMarcaAsync(string marca)
        {
            return await _context.Baterias
                .Where(b => b.marca == marca)
                .Select(b => new
                {
                    b.marca,
                    b.modelo,
                    b.arreglo,
                }).Cast<object>()
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<string>> ObtenerBateriasByModeloAsync()
        {
            return await _context.Baterias
                .AsNoTracking()
                .Select(p=>p.modelo)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerBateriasByModeloYMarcaAsync(string marca, string modelo)
        {
            return await _context.Baterias
                .Where(p => EF.Functions.ILike(p.marca, marca) && EF.Functions.ILike(p.modelo, modelo))
                .Select(m => new
                {
                    m.marca,
                    m.modelo,
                    m.arreglo,
                    m.costo,
                    m.id
                }).Cast<object>()
                .ToListAsync();
        }
    }
}
