using DrCell_V01.Data;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Services.Interface;

namespace DrCell_V01.Services
{
    public class EquiposService : ICelularesService
    {
        private readonly ApplicationDbContext _context;

        public EquiposService(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }
        public Task<Celular> GetEquiposAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Celular> GetMarcaEquiposAsync(int id, string marca)
        {
            throw new NotImplementedException();
        }

        public Task<Celular> GetModelosEquiposAsync(int id, string modelo)
        {
            throw new NotImplementedException();
        }
    }
}
