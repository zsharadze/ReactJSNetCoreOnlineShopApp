using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using AutoMapper;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository,
            IProductService productService, IMapper mapper)
        {
            _repository = orderRepository;
            _productService = productService;
            _mapper = mapper;
        }

        public async Task<int> CreateOrder(List<CreateOrderRequestDTO> orderItemList, string promoCode, string userId)
        {
            var orderItems = _mapper.Map<List<OrderItem>>(orderItemList);
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

        public Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageSize, int pageIndex)
        {
            return _repository.GetAllItemsForCurrentUser(userId, pageSize, pageIndex);
        }

        public Task<OrdersDTO> GetAllItems(int pageSize, int pageIndex)
        {
            return _repository.GetAllItems(pageSize, pageIndex);
        }

        public Task<int> ShipOrder(int id)
        {
            return _repository.ShipOrder(id);
        }
    }
}
