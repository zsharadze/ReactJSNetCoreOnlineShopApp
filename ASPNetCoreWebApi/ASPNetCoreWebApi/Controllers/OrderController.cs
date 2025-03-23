using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.BindingModels;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Extensions;

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

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateOrder([FromBody] List<CreateOrderRequestDTO> orderItems, string promoCode)
        {
            if (!orderItems.Any())
                throw new Exception("Invalid order items passed");
            return Ok(await _orderService.CreateOrder(orderItems, promoCode, User.GetCurrentUserId()));
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(OrdersDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllForCurrentUser(int pageIndex = 1, int pageSize = 10)
        {
            return Ok(await _orderService.GetAllItemsForCurrentUser(User.GetCurrentUserId(), pageIndex, pageSize));
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(OrdersDTO), StatusCodes.Status200OK)]

        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 10)
        {
            return Ok(await _orderService.GetAllItems(pageIndex, pageSize));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ShipOrder(int id)
        {
            return Ok(await _orderService.ShipOrder(id));
        }
    }
}
