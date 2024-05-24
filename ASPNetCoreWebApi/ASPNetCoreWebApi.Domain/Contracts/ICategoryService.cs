using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface ICategoryService
    {
        Task<CategoriesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex);
        Task<int> Add(Category newItem);
        Task<Category> Update(Category item);
        Task<Category> GetById(int id);
        Task<bool> Remove(int id);
    }
}
