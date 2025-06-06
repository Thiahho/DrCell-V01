using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace DrCell_V01.Services
{
    public class PinesService : IPinesService
    {
        private readonly ApplicationDbContext _context;

        public PinesService(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }

        public async Task<List<object>> ObtenerPinesAsync()
        {
            return await _context.Pines
                .AsNoTracking()
                .Select(p => new {p.marca, p.modelo})
                .Distinct()
                .Cast<object>()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerPinesByMarcaAsync(string marca)
        {
            return await _context.Pines
                .Where(p => p.marca == marca)
                .Select(p => new
                {
                   p.marca,
                   p.modelo,
                   p.arreglo
                }).Cast<object>()
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<string>> ObtenerPinesByModeloAsync()
        {
            return await _context.Pines
                .AsNoTracking()
                .Select(p=>p.modelo)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<object>> ObtenerPinesByModeloYMarcaAsync(string marca, string modelo)
        {
            return await _context.Pines
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
