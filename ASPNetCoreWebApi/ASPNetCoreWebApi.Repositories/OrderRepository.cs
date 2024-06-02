﻿using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public OrderRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper;
        }

        public async Task<int> CreateOrder(List<OrderItem> orderItems, string promoCode, decimal subTotal, string userId)
        {
            using var transaction = _context.Database.BeginTransaction();
            Order order = new Order();
            order.CreatedDate = DateTime.Now;
            order.UserId = userId;
            order.Subtotal = subTotal;
            var promoCodeEntity = await _context.PromoCodes.SingleOrDefaultAsync(x => x.PromoCodeText == promoCode);
            if (!string.IsNullOrEmpty(promoCode))
            {
                if (promoCodeEntity != null)
                {
                    if (promoCodeEntity.IsUsed)
                    {
                        throw new Exception("Applied promo code already used.");
                    }
                    order.PromoCodeId = promoCodeEntity.Id;
                    var diff = order.Subtotal - promoCodeEntity.Discount;
                    order.SubtotalWithPromo = diff > 0 ? diff : 0;
                    promoCodeEntity.IsUsed = true;
                }
            }

            _context.Orders.Add(order);
            try
            {
                await _context.SaveChangesAsync();

                foreach (var item in orderItems)
                {
                    item.OrderId = order.Id;
                }
                _context.OrderItems.AddRange(orderItems);

                if (promoCodeEntity != null)
                {
                    promoCodeEntity.OrderId = order.Id;
                    _context.PromoCodes.Update(promoCodeEntity);
                }
                var result = await _context.SaveChangesAsync();
                transaction.Commit();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageSize, int pageIndex)
        {
            OrdersDTO result = new OrdersDTO();

            var orders = _context.Orders.AsNoTracking()
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
                .Include(x => x.PromoCode)
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.Id);

            int totalCount = await orders.CountAsync();
            PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex, pageSize, "");
            result.Pager = pagerHelper.GetPager;

            result.OrderList = await orders.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                .Take(pagerHelper.PageSize)
                .Select(x => new OrderForListDto()
                {
                    Id = x.Id,
                    CreatedDate = x.CreatedDate,
                    IsShipped = x.IsShipped,
                    PromoCodeId = x.PromoCodeId,
                    OrderItems = x.OrderItems.Select(ot => new OrderItemDTO()
                    {
                        Id = ot.Id,
                        ProductId = ot.ProductId,
                        Product = new ProductDTO()
                        {
                            Id = ot.Product.Id,
                            CategoryId = ot.Product.CategoryId,
                            CreatedDate = ot.Product.CreatedDate,
                            Description = ot.Product.Description,
                            ImageSrc = ot.Product.ImageSrc,
                            Name = ot.Product.Name,
                            Price = ot.Product.Price
                        },
                        Quantity = ot.Quantity
                    }).ToList(),
                    PromoCode = x.PromoCode == null ? null : new PromoCodeDTO()
                    {
                        Id = x.PromoCode.Id,
                        CreatedDate = x.PromoCode.CreatedDate,
                        Discount = x.PromoCode.Discount,
                        IsUsed = x.PromoCode.IsUsed,
                        PromoCodeText = x.PromoCode.PromoCodeText,
                        UsedByUserEmail = x.PromoCode.UsedByUserEmail,
                        UsedOnOrderId = x.PromoCode.OrderId,
                    },
                    Subtotal = x.Subtotal,
                    SubtotalWithPromo = x.SubtotalWithPromo,
                    UserEmail = x.UserEmail,
                    UserId = x.UserId
                })
                .ToListAsync();
            return result;
        }

        public async Task<OrdersDTO> GetAllItems(int pageSize, int pageIndex)
        {
            OrdersDTO result = new OrdersDTO();

            int totalCount = await _context.Orders.AsNoTracking().CountAsync();
            PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex, pageSize, "");
            result.Pager = pagerHelper.GetPager;
            result.OrderList = await _context.Orders.AsNoTracking()
                .Include(x => x.PromoCode)
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Product)
                .Include(x => x.User)
                .OrderByDescending(x => x.Id)
                .Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                .Take(pagerHelper.PageSize)
                .Select(x => new OrderForListDto
                {
                    CreatedDate = x.CreatedDate,
                    Id = x.Id,
                    IsShipped = x.IsShipped,
                    OrderItems = x.OrderItems.Select(ot => new OrderItemDTO()
                    {
                        Id = ot.Id,
                        ProductId = ot.ProductId,
                        Product = new ProductDTO()
                        {
                            Id = ot.Product.Id,
                            CategoryId = ot.Product.CategoryId,
                            CreatedDate = ot.Product.CreatedDate,
                            Description = ot.Product.Description,
                            ImageSrc = ot.Product.ImageSrc,
                            Name = ot.Product.Name,
                            Price = ot.Product.Price
                        },
                        Quantity = ot.Quantity
                    }).ToList(),
                    PromoCode = x.PromoCode == null ? null : new PromoCodeDTO()
                    {
                        Id = x.PromoCode.Id,
                        CreatedDate = x.PromoCode.CreatedDate,
                        Discount = x.PromoCode.Discount,
                        IsUsed = x.PromoCode.IsUsed,
                        PromoCodeText = x.PromoCode.PromoCodeText,
                        UsedByUserEmail = x.PromoCode.UsedByUserEmail,
                        UsedOnOrderId = x.PromoCode.OrderId,
                    },
                    PromoCodeId = x.PromoCodeId,
                    Subtotal = x.Subtotal,
                    SubtotalWithPromo = x.SubtotalWithPromo,
                    UserEmail = x.User.Email
                })
                .ToListAsync();
            return result;

        }

        public async Task<int> ShipOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                throw new Exception("Order with id: " + id + " not found.");
            }

            order.IsShipped = true;

            return await _context.SaveChangesAsync();
        }
    }
}
