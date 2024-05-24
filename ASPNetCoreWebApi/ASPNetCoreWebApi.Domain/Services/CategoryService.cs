using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            this._repository = repository;
        }

        public Task<int> Add(Category newItem)
        {
            return _repository.Add(newItem);
        }

        public Task<CategoriesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex)
        {
            return _repository.GetAllItems(searchText, pageSize, pageIndex);
        }

        public Task<Category> GetById(int id)
        {
            return _repository.GetById(id);
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }

        public Task<Category> Update(Category item)
        {
            return _repository.Update(item);
        }
    }
}
