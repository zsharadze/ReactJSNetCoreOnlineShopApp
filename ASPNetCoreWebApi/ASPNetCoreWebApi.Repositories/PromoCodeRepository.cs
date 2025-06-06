﻿using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using AutoMapper;

namespace ASPNetCoreWebApi.Repositories
{
    public class PromoCodeRepository : IPromoCodeRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public PromoCodeRepository(ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper;
        }

        public async Task<int> Add(PromoCode newItem)
        {
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

        public async Task GeneratePromoCodes(int quantity, int discount)
        {
            var newPromoCodesList = new List<PromoCode>();
            for (int i = 0; i < quantity; i++)
            {
                PromoCode newPromoCode = new PromoCode();
                newPromoCode.CreatedDate = DateTime.Now;
                newPromoCode.Discount = discount;
                newPromoCode.PromoCodeText = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();
                newPromoCodesList.Add(newPromoCode);
            }

            await _context.PromoCodes.AddRangeAsync(newPromoCodesList);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<PromoCodesDTO> GetAllItems(string searchText, int pageIndex, int pageSize, bool? getOnlyUsed)
        {
            var result = new PromoCodesDTO();
            result.PromoCodeList = new List<PromoCodeDTO>();

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

            int totalCount = await promoCodes.CountAsync();
            PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex, pageSize, summaryTextAdd);
            result.Pager = pagerHelper.GetPager;
            result.PromoCodeList = await promoCodes.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                .Take(pagerHelper.PageSize)
                .ProjectTo<PromoCodeDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return result;
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

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}