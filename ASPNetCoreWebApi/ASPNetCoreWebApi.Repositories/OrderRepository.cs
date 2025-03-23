using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ASPNetCoreWebApi.Repositories
{
    public class OrderRepository : IOrderRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;
        private Expression<Func<Order, OrderForListDto>> OrderListExpression = x =>
                 new OrderForListDto
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
                             ImageName = ot.Product.ImageName,
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
                     UserEmail = x.User.Email,
                     UserId = x.UserId
                 };


        public OrderRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
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

            await _context.Orders.AddAsync(order);
            try
            {
                await _context.SaveChangesAsync();

                foreach (var item in orderItems)
                {
                    item.OrderId = order.Id;
                }
                await _context.OrderItems.AddRangeAsync(orderItems);

                if (promoCodeEntity != null)
                {
                    promoCodeEntity.OrderId = order.Id;
                    _context.PromoCodes.Update(promoCodeEntity);
                }
                var result = await _context.SaveChangesAsync();
                transaction.Commit();
                return result;
            }
            catch
            {
                throw;
            }
        }

        public async Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageIndex, int pageSize)
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
                .Select(OrderListExpression)
                .ToListAsync();
            return result;
        }

        public async Task<OrdersDTO> GetAllItems(int pageIndex, int pageSize)
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
                .Select(OrderListExpression)
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

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}
