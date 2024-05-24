﻿using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IPromoCodeRepository
    {
        Task<PromoCodesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex, bool? getOnlyUsed);
        Task<int> Add(PromoCode newItem);
        Task<bool> Remove(int id);
        Task<bool> GeneratePromoCodes(int quantity, int discount);
        Task<PromoCode> GetByPromoCodeText(string promoCodeText);
    }
}