using AutoMapper;
using DrCell_V01.Data.Modelos;
using DrCell_V01.Data.Dtos;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Entidad -> DTO
        CreateMap<Productos, ProductoDto>().ReverseMap();
        CreateMap<ProductosVariantes, ProductosVariantesDto>().ReverseMap();
        // Agrega aquí todos los mapeos que necesites
    }
}
