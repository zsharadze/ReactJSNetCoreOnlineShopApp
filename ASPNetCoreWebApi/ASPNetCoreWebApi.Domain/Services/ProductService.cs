using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using AutoMapper;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _repository = productRepository;
            _mapper = mapper;
        }

        public Task<int> Add(ProductDTO newItem)
        {
            newItem.CreatedDate = DateTime.Now;
            return _repository.Add(_mapper.Map<Product>(newItem));
        }

        public Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageSize, int pageIndex)
        {
            return _repository.GetAllItems(categoryId, searchText, pageSize, pageIndex);
        }

        public Task<List<ProductDTO>> GetAllByIds(List<int> ids)
        {
            return _repository.GetAllByIds(ids);
        }

        public async Task<ProductDTO> GetById(int id)
        {
            return _mapper.Map<ProductDTO>(await _repository.GetById(id));
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }

        public Task<Product> Update(ProductDTO item)
        {
            return _repository.Update(_mapper.Map<Product>(item));
        }
    }
}
