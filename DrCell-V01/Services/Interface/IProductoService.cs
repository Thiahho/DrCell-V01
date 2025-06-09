using DrCell_V01.Data.Modelos;

namespace DrCell_V01.Services.Interface
{
    public interface IProductoService
    {

        Task<IEnumerable<Productos>> GetAllVariantesAsync();
        Task<Productos> GetByIdWithVarianteAsync(int id);
        Task<Productos> AddAsync(Productos productos);
        Task<ProductosVariantes> AddVarianteAsync(ProductosVariantes productosVariantes);
        Task UpdateAsync(Productos productos);
        Task DeleteAsync(int id);
        Task<IEnumerable<ProductosVariantes>> GetVariantesByIdAsync( int productId);
        Task<ProductosVariantes> GetVarianteSpecAsync(int productId, string ram, string storage, string color, string condicion);
        Task<IEnumerable<string>> GetDistintAlmacenamientosAsync(string ram, int productId);
        Task<IEnumerable<string>> GetDistintColorAsync(string ram, string almacenamiento, int productId);
        Task<IEnumerable<Productos>> GetAllProductsAsync();
        
    }
}
