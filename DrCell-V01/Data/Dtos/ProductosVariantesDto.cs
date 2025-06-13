using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DrCell_V01.Data.Dtos
{
    public class ProductosVariantesDto
    {
        public int ProductoId { get; set; }
        public string Ram { get; set; }
        public string Almacenamiento { get; set; }
        public string Color { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }
    }
}