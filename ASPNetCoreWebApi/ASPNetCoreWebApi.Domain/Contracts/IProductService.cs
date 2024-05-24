using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IProductService
    {
        Task<ProductsViewModel> GetAllItems(int? categoryId, string searchText, int? pageSize, int? pageIndex);
        Task<List<Product>> GetAllByIds(List<int> ids);
        Task<int> Add(Product newItem);
        Task<Product> Update(Product item);
        Task<Product> GetById(int id);
        Task<bool> Remove(int id);
    }
}
