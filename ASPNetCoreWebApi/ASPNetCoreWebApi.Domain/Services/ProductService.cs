using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository productRepository)
        {
            this._repository = productRepository;
        }

        public Task<int> Add(Product newItem)
        {
            return _repository.Add(newItem);
        }

        public Task<ProductsViewModel> GetAllItems(int? categoryId, string searchText, int? pageSize, int? pageIndex)
        {
            return _repository.GetAllItems(categoryId, searchText, pageSize, pageIndex);
        }

        public Task<List<Product>> GetAllByIds(List<int> ids)
        {
            return _repository.GetAllByIds(ids);
        }

        public Task<Product> GetById(int id)
        {
            return _repository.GetById(id);
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }

        public Task<Product> Update(Product item)
        {
            return _repository.Update(item);
        }
    }
}
