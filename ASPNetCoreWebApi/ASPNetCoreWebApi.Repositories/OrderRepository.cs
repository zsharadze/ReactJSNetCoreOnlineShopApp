using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;
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

        public async Task<OrdersViewModel> GetAllItemsForCurrentUser(string userId, int? pageSize, int? pageIndex)
        {
            OrdersViewModel result = new OrdersViewModel();

            if (pageSize == null || pageIndex == null)
            {
                result.OrderList = await _context.Orders.AsNoTracking().Include(x => x.OrderItems)
            .ThenInclude(x => x.Product).Include(x => x.PromoCode).Where(x => x.UserId == userId).OrderByDescending(x => x.Id).ToListAsync();
                return result;
            }

            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                var orders = _context.Orders.AsNoTracking().Include(x => x.OrderItems)
            .ThenInclude(x => x.Product).Include(x => x.PromoCode).Where(x => x.UserId == userId).OrderByDescending(x => x.Id);

                int totalCount = await orders.CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, "");
                result.Pager = pagerHelper.GetPager;

                result.OrderList = await orders.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                    .Take(pagerHelper.PageSize)
                    .ToListAsync();

                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<OrdersViewModel> GetAllItems(int? pageSize, int? pageIndex)
        {
            OrdersViewModel result = new OrdersViewModel();
            if (pageSize == null || pageIndex == null)
            {
                result.OrderList = await _context.Orders
                    .AsNoTracking()
                    .Include(x => x.PromoCode)
                    .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                    .Select(x => new Order
                    {
                        CreatedDate = x.CreatedDate,
                        Id = x.Id,
                        IsShipped = x.IsShipped,
                        OrderItems = x.OrderItems,
                        PromoCode = x.PromoCode,
                        PromoCodeId = x.PromoCodeId,
                        Subtotal = x.Subtotal,
                        SubtotalWithPromo = x.SubtotalWithPromo,
                        UserEmail = x.User.Email
                    })
                    .OrderByDescending(x => x.Id)
                    .ToListAsync();
                return result;
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await _context.Orders.AsNoTracking().CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, "");
                result.Pager = pagerHelper.GetPager;
                result.OrderList = await _context.Orders.AsNoTracking()
                    .Include(x => x.PromoCode)
                    .Include(x => x.OrderItems)
                    .ThenInclude(x => x.Product)
                    .Include(x => x.User)
                    .OrderByDescending(x => x.Id)
                    .Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                    .Take(pagerHelper.PageSize)
                    .Select(x => new Order
                    {
                        CreatedDate = x.CreatedDate,
                        Id = x.Id,
                        IsShipped = x.IsShipped,
                        OrderItems = x.OrderItems,
                        PromoCode = x.PromoCode,
                        PromoCodeId = x.PromoCodeId,
                        Subtotal = x.Subtotal,
                        SubtotalWithPromo = x.SubtotalWithPromo,
                        UserEmail = x.User.Email
                    })
                    .ToListAsync();
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
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
