using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Infrastructure;
using ASPNetCoreWebApi.BindingModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly ImageFileSizeValidator _imageFileSizeValidator;
        public ProductController(IProductService productService, ImageFileSizeValidator imageFileSizeValidator)
        {
            _productService = productService;
            _imageFileSizeValidator = imageFileSizeValidator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ProductsDTO), 200)]
        public async Task<IActionResult> GetAll(int? categoryId, string searchText, int pageSize = 20, int pageIndex = 1)
        {
            return Ok(await _productService.GetAllItems(categoryId, searchText, pageSize, pageIndex));
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<ProductDTO>), 200)]
        public async Task<IActionResult> GetAllByIds(List<int> ids)
        {
            return Ok(await _productService.GetAllByIds(ids));
        }

        [HttpGet]
        [ProducesResponseType(typeof(ProductDTO), 200)]
        public async Task<IActionResult> Details(int id)
        {
            return Ok(await _productService.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Create([FromBody] ProductDTO product)
        {
            var validImageSizeResult = _imageFileSizeValidator.IsValidSize(product.ImageSrc);
            if (!validImageSizeResult.Item1)
            {
                return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
            }

            await _productService.Add(product);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Edit([FromBody] ProductDTO product)
        {
            var validImageSizeResult = _imageFileSizeValidator.IsValidSize(product.ImageSrc);
            if (!validImageSizeResult.Item1)
            {
                return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
            }

            await _productService.Update(product);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _productService.Remove(id);
            if (success)
                return Ok(new ApiResponse() { Success = true, Message = "" });
            else
                return Ok(new ApiResponse() { Success = false, Message = "Unhandled exception occured." });
        }

        public string CurrentUserId
        {
            get
            {
                return User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
        }
    }
}
