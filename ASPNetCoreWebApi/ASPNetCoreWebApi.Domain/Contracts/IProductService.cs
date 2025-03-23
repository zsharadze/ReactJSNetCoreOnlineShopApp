using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IProductService
    {
        Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageIndex, int pageSize);
        Task<List<ProductDTO>> GetAllByIds(List<int> ids);
        Task<int> Add(ProductDTO newItem);
        Task<Product> Update(ProductDTO item);
        Task<ProductDTO> GetById(int id);
        Task Remove(int id);
    }
}
