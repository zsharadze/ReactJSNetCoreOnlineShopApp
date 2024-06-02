using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IOrderService
    {
        Task<int> CreateOrder(List<CreateOrderRequestDTO> orderItemList, string promoCode, string userId);
        Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageSize, int pageIndex);
        Task<OrdersDTO> GetAllItems(int pageSize, int pageIndex);
        Task<int> ShipOrder(int id);
    }
}
