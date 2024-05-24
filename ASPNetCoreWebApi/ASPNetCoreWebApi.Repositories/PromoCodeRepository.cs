using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Repositories
{
    public class PromoCodeRepository : IPromoCodeRepository
    {
        private readonly ApplicationDbContext _context;

        public PromoCodeRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> Add(PromoCode newItem)
        {
            newItem.CreatedDate = DateTime.Now;
            _context.PromoCodes.Add(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> GeneratePromoCodes(int quantity, int discount)
        {
            for (int i = 0; i < quantity; i++)
            {
                PromoCode newPromoCode = new PromoCode();
                newPromoCode.CreatedDate = DateTime.Now;
                newPromoCode.Discount = discount;
                newPromoCode.PromoCodeText = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
                await _context.PromoCodes.AddAsync(newPromoCode);

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    return false;
                }
            }

            return true;
        }

        public async Task<PromoCodesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex, bool? getOnlyUsed)
        {
            var result = new PromoCodesViewModel();
            result.PromoCodeList = new List<PromoCode>();

            var promoCodes = _context.PromoCodes.AsNoTracking().Include(x => x.Order).ThenInclude(x => x.User).AsQueryable();

            string summaryTextAdd = "";

            if (searchText != null || getOnlyUsed.Value)
            {
                summaryTextAdd = $" (filtered from {await promoCodes.CountAsync()} total entries)";
            }

            promoCodes = promoCodes.OrderByDescending(x => x.Id);

            if (searchText != null)
            {
                promoCodes = promoCodes.Where(x => x.PromoCodeText == searchText);
            }

            if (getOnlyUsed.Value)
            {
                promoCodes = promoCodes.Where(x => x.IsUsed);
            }

            if (pageSize == null || pageIndex == null)
            {
                result.PromoCodeList = await promoCodes.Select(x => new PromoCode
                {
                    CreatedDate = x.CreatedDate,
                    Discount = x.Discount,
                    Id = x.Id,
                    IsUsed = x.IsUsed,
                    PromoCodeText = x.PromoCodeText,
                    UsedOnOrderId = x.Order.Id,
                    UsedByUserEmail = x.Order.User.Email

                }).ToListAsync();
                return result;
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await promoCodes.CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, summaryTextAdd);
                result.Pager = pagerHelper.GetPager;
                result.PromoCodeList = await promoCodes.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize).Take(pagerHelper.PageSize).Select(x => new PromoCode
                {
                    CreatedDate = x.CreatedDate,
                    Discount = x.Discount,
                    Id = x.Id,
                    IsUsed = x.IsUsed,
                    PromoCodeText = x.PromoCodeText,
                    UsedOnOrderId = x.Order.Id,
                    UsedByUserEmail = x.Order.User.Email

                }).ToListAsync();
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<PromoCode> GetByPromoCodeText(string promoCodeText)
        {
            var promoCode = await _context.PromoCodes.SingleOrDefaultAsync(x => x.PromoCodeText == promoCodeText);
            if (promoCode != null && !promoCode.IsUsed)
                return promoCode;
            else
                return null;
        }

        public async Task<bool> Remove(int id)
        {
            PromoCode entity = await _context.PromoCodes.SingleOrDefaultAsync(a => a.Id == id);
            if (entity.IsUsed)
            {
                return false;
            }
            if (entity != null)
            {
                _context.PromoCodes.Remove(entity);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }

            return true;
        }
    }
}