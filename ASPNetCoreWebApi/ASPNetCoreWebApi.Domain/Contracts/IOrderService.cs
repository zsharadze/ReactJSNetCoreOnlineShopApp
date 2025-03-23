using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IOrderService
    {
        Task<int> CreateOrder(List<CreateOrderRequestDTO> orderItemList, string promoCode, string userId);
        Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageIndex, int pageSize);
        Task<OrdersDTO> GetAllItems(int pageIndex, int pageSize);
        Task<int> ShipOrder(int id);
    }
}
