using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;
        private readonly IProductService _productService;

        public OrderService(IOrderRepository orderRepository, IProductService productService)
        {
            this._repository = orderRepository;
            _productService = productService;
        }

        public async Task<int> CreateOrder(List<OrderItem> orderItems, string promoCode, string userId)
        {
            decimal subTotal = 0;
            foreach (var item in orderItems)
            {
                var product = await _productService.GetById(item.ProductId);
                if (product == null)
                {
                    throw new Exception("product with id " + item.Id + " not found.");
                }

                subTotal += product.Price * item.Quantity;
            }

            return await _repository.CreateOrder(orderItems, promoCode, subTotal, userId);
        }

        public Task<OrdersViewModel> GetAllItemsForCurrentUser(string userId, int? pageSize, int? pageIndex)
        {
            return _repository.GetAllItemsForCurrentUser(userId, pageSize, pageIndex);
        }

        public Task<OrdersViewModel> GetAllItems(int? pageSize, int? pageIndex)
        {
            return _repository.GetAllItems(pageSize, pageIndex);
        }

        public Task<int> ShipOrder(int id)
        {
            return _repository.ShipOrder(id);
        }
    }
}
