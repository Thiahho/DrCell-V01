using DrCell_V01.Data.Modelos;

namespace DrCell_V01.Services.Interface
{
    public interface IPinesService
    {
        //PINES
        Task<List<object>> ObtenerPinesAsync();
        Task<List<object>> ObtenerPinesByMarcaAsync(string marca);
        Task<List<string>> ObtenerPinesByModeloAsync();
        Task<List<object>> ObtenerPinesByModeloYMarcaAsync(string marca, string modelo);
    }
}
