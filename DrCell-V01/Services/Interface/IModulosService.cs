using DrCell_V01.Data.Modelos;

namespace DrCell_V01.Services.Interface
{
    public interface IModulosService
    {

        //////
        //MODULOS
        Task<List<object>> ObtenerModulosAsync();
        Task<List<object>> ObtenerModulosByMarcaAsync(string marca);
        Task<List<object>> ObtenerModulosByModeloAsync(string modelo);
        Task<List<object>> ObtenerModulosByModeloYMarcaAsync(string marca, string modelo);
    }
}
