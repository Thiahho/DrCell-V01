using Microsoft.AspNetCore.Identity;

namespace DrCell_V01.Data.Modelos
{
    public class Usuario : IdentityUser<int>
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string ClaveHash { get; set; } = string.Empty;
        public string Rol { get; set; } = "Admin";
    }
}
