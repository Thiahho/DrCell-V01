using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DrCell_V01.Data.Dtos
{
    public class ProductoDto
    {
        public int Id { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public string Categoria { get; set; }
        public byte[] Img { get; set; }
        public List<ProductosVariantesDto> Variantes { get; set; }
    }
}