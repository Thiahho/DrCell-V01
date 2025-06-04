using DrCell_V01.Data.Modelos;
using Microsoft.AspNetCore.Mvc;

namespace DrCell_V01.Services.Interface
{
    public interface IUsuarioService
    {
        public Task<Usuario> ValidarCredencialesAsync(string userName, string password);
        public Task CrearUsuarioAsync(Usuario usuario);
        public Task<Usuario> ObtenerUsuarioPorEmailAsync(string email);

        public string GenerarToken(Usuario usuario);


    }
}
