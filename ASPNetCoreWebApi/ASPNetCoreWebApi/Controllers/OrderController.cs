using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.BindingModels;
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
        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
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
        public async Task<IActionResult> CreateOrder([FromBody] List<CreateOrderRequestDTO> orderItems, string promoCode)
        {
            if (!orderItems.Any())
                throw new Exception("Invalid order items passed");
            return Ok(await _orderService.CreateOrder(orderItems, promoCode, CurrentUserId));
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(OrdersDTO), 200)]
        public async Task<IActionResult> GetAllForCurrentUser(int pageSize = 20, int pageIndex = 1)
        {
            return Ok(await _orderService.GetAllItemsForCurrentUser(CurrentUserId, pageSize, pageIndex));
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(OrdersDTO), 200)]

        public async Task<IActionResult> GetAll(int pageSize = 20, int pageIndex = 1)
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
