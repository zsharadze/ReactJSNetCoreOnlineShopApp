using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class PromoCodeService : IPromoCodeService
    {
        private readonly IPromoCodeRepository _repository;

        public PromoCodeService(IPromoCodeRepository promoCodeRepository)
        {
            this._repository = promoCodeRepository;
        }

        public Task<int> Add(PromoCode newItem)
        {
            return _repository.Add(newItem);
        }

        public Task<bool> GeneratePromoCodes(int quantity, int discount)
        {
            return _repository.GeneratePromoCodes(quantity, discount);
        }

        public Task<PromoCodesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex, bool? getOnlyUsed)
        {
            return _repository.GetAllItems(searchText, pageSize, pageIndex, getOnlyUsed);
        }

        public Task<PromoCode> GetByPromoCodeText(string promoCodeText)
        {
            return _repository.GetByPromoCodeText(promoCodeText);
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }
    }
}
