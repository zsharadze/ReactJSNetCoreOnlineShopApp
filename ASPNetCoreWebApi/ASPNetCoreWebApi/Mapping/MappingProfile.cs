using ASPNetCoreWebApi.Models;
using AutoMapper;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateOrderRequestModel, OrderItem>();
        }
    }
}
