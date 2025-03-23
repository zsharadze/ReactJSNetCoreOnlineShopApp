using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IOrderRepository
    {
        Task<int> CreateOrder(List<OrderItem> orderItems, string promoCode, decimal subTotal, string userId);
        Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageIndex, int pageSize);
        Task<OrdersDTO> GetAllItems(int pageIndex, int pageSize);
        Task<int> ShipOrder(int id);
    }
}
