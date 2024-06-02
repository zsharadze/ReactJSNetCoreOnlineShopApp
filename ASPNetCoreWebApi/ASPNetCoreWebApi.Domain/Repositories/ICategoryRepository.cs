using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<CategoriesDTO> GetAllItems(string searchText, int? pageSize, int? pageIndex);
        Task<int> Add(Category newItem);
        Task<Category> Update(Category item);
        Task<Category> GetById(int id);
        Task<bool> Remove(int id);
    }
}
