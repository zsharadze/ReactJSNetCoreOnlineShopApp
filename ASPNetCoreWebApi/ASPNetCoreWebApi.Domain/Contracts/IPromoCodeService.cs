using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IPromoCodeService
    {
        Task<PromoCodesDTO> GetAllItems(string searchText, int pageIndex, int pageSize, bool? getOnlyUsed);
        Task<int> Add(PromoCode newItem);
        Task<bool> Remove(int id);
        Task GeneratePromoCodes(int quantity, int discount);
        Task<PromoCodeDTO> GetByPromoCodeText(string promoCodeText);
    }
}
