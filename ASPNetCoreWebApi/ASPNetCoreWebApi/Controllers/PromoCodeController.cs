using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.BindingModels;
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
        [ProducesResponseType(typeof(PromoCodesDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string searchText = null, int pageIndex = 1, int pageSize = 10, bool? getOnlyUsed = false)
        {
            return Ok(await _promoCodeService.GetAllItems(searchText, pageIndex, pageSize, getOnlyUsed));
        }

        [HttpGet]
        [ProducesResponseType(typeof(PromoCodeDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByPromoCodeText(string promoCodeText)
        {
            return Ok(await _promoCodeService.GetByPromoCodeText(promoCodeText));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GeneratePromoCodes(int quantity, int discount)
        {
            await _promoCodeService.GeneratePromoCodes(quantity, discount);
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _promoCodeService.Remove(id);

            if (!success)
            {
                ModelState.AddModelError("errors", "Used promo code can't be deleted.");
                return BadRequest(ModelState);
            }
            return Ok();
        }
    }
}
