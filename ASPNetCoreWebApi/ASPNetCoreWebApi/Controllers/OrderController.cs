using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        public string CurrentUserId
        {
            get
            {
                return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> CreateOrder([FromBody] List<CreateOrderRequestModel> orderItems, string promoCode)
        {
            if (!orderItems.Any())
                throw new Exception("Invalid order items passed");
            var orderItemObjects = _mapper.Map<List<OrderItem>>(orderItems);
            return Ok(await _orderService.CreateOrder(orderItemObjects, promoCode, CurrentUserId));
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(OrdersViewModel), 200)]
        public async Task<IActionResult> GetAllForCurrentUser(int? pageSize = 20, int? pageIndex = 1)
        {

            return Ok(await _orderService.GetAllItemsForCurrentUser(CurrentUserId, pageSize, pageIndex));
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(OrdersViewModel), 200)]

        public async Task<IActionResult> GetAll(int? pageSize = 20, int? pageIndex = 1)
        {
            return Ok(await _orderService.GetAllItems(pageSize, pageIndex));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(int), 200)]
        public async Task<IActionResult> ShipOrder(int id)
        {
            return Ok(await _orderService.ShipOrder(id));
        }
    }
}
