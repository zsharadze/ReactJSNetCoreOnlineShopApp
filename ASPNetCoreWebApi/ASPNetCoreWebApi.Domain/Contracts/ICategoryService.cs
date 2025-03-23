using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface ICategoryService
    {
        Task<CategoriesDTO> GetAllItems(string searchText, int? pageIndex, int? pageSize);
        Task<int> Add(CategoryDTO newItem);
        Task<Category> Update(CategoryDTO item);
        Task<CategoryDTO> GetById(int id);
        Task<bool> Remove(int id);
    }
}
