using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DrCell_V01.Data.Modelos
{
    public class ProductosVariantes
    {
        [Key]
        public int Id { get; set; }
        public int ProductoId { get; set; }
        [Column("stock")]
        public int Stock { get; set; }
        [Column("color")]
        [Required]
        public required string Color { get; set; }
        [Column("ram")]
        [Required]
        public required string Ram { get; set; }
        [Column("modelo")]
        [Required]
        public required string Almacenamiento { get; set; }
        [Column("precio")]
        public decimal Precio { get; set; }

        public required Productos Producto { get; set; }



    }
}
