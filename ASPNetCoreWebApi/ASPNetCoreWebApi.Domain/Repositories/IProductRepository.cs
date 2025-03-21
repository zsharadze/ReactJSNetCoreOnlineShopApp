using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IProductRepository
    {
        Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageSize, int pageIndex);
        Task<List<ProductDTO>> GetAllByIds(List<int> ids);
        Task<int> Add(Product newItem);
        Task<Product> Update(Product item);
        Task<ProductDTO> GetById(int id);
        Task<bool> Remove(int id);
    }
}
