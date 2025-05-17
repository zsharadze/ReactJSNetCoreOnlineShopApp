using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using AutoMapper;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public Task<int> Add(CategoryDTO newItem)
        {
            return _repository.Add(_mapper.Map<Category>(newItem));
        }

        public Task<CategoriesDTO> GetAllItems(string searchText, int? pageIndex, int? pageSize)
        {
            return _repository.GetAllItems(searchText, pageIndex, pageSize);
        }

        public async Task<CategoryDTO> GetById(int id)
        {
            return _mapper.Map<CategoryDTO>(await _repository.GetById(id));
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }

        public Task<Category> Update(CategoryDTO item)
        {
            return _repository.Update(_mapper.Map<Category>(item));
        }
    }
}
