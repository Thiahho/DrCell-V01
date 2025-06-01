using DrCell_V01.Data.Modelos;

namespace DrCell_V01.Services.Interface
{
    public interface ICelularesService
    {
        Task<Celular> GetEquiposAsync();
        Task<Celular> GetMarcaEquiposAsync(int id, string marca);
        Task<Celular> GetModelosEquiposAsync(int id, string modelo);


    }
}
