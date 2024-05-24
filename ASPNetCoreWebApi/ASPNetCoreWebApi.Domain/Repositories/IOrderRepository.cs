using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task<int> CreateOrder(List<OrderItem> orderItems, string promoCode, decimal subTotal, string userId);
        Task<OrdersViewModel> GetAllItemsForCurrentUser(string userId, int? pageSize, int? pageIndex);
        Task<OrdersViewModel> GetAllItems(int? pageSize, int? pageIndex);
        Task<int> ShipOrder(int id);
    }
}
