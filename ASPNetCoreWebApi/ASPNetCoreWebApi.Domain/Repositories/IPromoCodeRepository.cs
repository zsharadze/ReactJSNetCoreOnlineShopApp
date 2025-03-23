using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IPromoCodeRepository
    {
        Task<PromoCodesDTO> GetAllItems(string searchText, int pageIndex, int pageSize, bool? getOnlyUsed);
        Task<int> Add(PromoCode newItem);
        Task<bool> Remove(int id);
        Task GeneratePromoCodes(int quantity, int discount);
        Task<PromoCode> GetByPromoCodeText(string promoCodeText);
    }
}
