using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.ViewModels;
using ASPNetCoreWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PromoCodeController : Controller
    {
        private readonly IPromoCodeService _promoCodeService;

        public PromoCodeController(IPromoCodeService promoCodeService)
        {
            _promoCodeService = promoCodeService;
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(PromoCodesViewModel), 200)]
        public async Task<IActionResult> GetAll(string searchText = null, int? pageSize = 20, int? pageIndex = 1, bool? getOnlyUsed = false)
        {
            return Ok(await _promoCodeService.GetAllItems(searchText, pageSize, pageIndex, getOnlyUsed));
        }

        [HttpGet]
        [ProducesResponseType(typeof(PromoCode), 200)]
        public async Task<IActionResult> GetByPromoCodeText(string promoCodeText)
        {
            return Ok(await _promoCodeService.GetByPromoCodeText(promoCodeText));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> GeneratePromoCodes(int quantity, int discount)
        {
            var success = await _promoCodeService.GeneratePromoCodes(quantity, discount);
            if (success)
                return Ok(new ApiResponse() { Success = true, Message = "" });
            else
                return Ok(new ApiResponse() { Success = false, Message = "Unhandled exception occured." });
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _promoCodeService.Remove(id);

            if (success)
                return Ok(new ApiResponse() { Success = true, Message = "" });
            else
                return Ok(new ApiResponse() { Success = false, Message = "Used promo code can't be deleted." });
        }
    }
}
