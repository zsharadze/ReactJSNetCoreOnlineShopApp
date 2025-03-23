using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IProductRepository
    {
        Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageIndex, int pageSize);
        Task<List<ProductDTO>> GetAllByIds(List<int> ids);
        Task<int> Add(Product newItem);
        Task<Product> Update(Product item);
        Task<ProductDTO> GetById(int id);
        Task Remove(int id);
    }
}
