using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using AutoMapper;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class PromoCodeService : IPromoCodeService
    {
        private readonly IPromoCodeRepository _repository;
        private readonly IMapper _mapper;

        public PromoCodeService(IPromoCodeRepository promoCodeRepository, IMapper mapper)
        {
            _repository = promoCodeRepository;
            _mapper = mapper;
        }

        public Task<int> Add(PromoCode newItem)
        {
            newItem.CreatedDate = DateTime.Now;
            return _repository.Add(newItem);
        }

        public Task<bool> GeneratePromoCodes(int quantity, int discount)
        {
            return _repository.GeneratePromoCodes(quantity, discount);
        }

        public Task<PromoCodesDTO> GetAllItems(string searchText, int pageSize, int pageIndex, bool? getOnlyUsed)
        {
            return _repository.GetAllItems(searchText, pageSize, pageIndex, getOnlyUsed);
        }

        public async Task<PromoCodeDTO> GetByPromoCodeText(string promoCodeText)
        {
            return _mapper.Map<PromoCodeDTO>(await _repository.GetByPromoCodeText(promoCodeText));
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }
    }
}
