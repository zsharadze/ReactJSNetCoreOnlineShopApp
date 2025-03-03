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
        private readonly ImageSaver _imageSaver;
        private readonly ImageDeleter _imageDeleter;
        public ProductController(IProductService productService,
            ImageFileSizeValidator imageFileSizeValidator,
            ImageSaver imageSaver,
            ImageDeleter imageDeleter)
        {
            _productService = productService;
            _imageFileSizeValidator = imageFileSizeValidator;
            _imageSaver = imageSaver;
            _imageDeleter = imageDeleter;
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
        public async Task<IActionResult> Create([FromForm] ProductDTO product)
        {
            var validImageSizeResult = _imageFileSizeValidator.IsValidSize(product.ImageFile);
            if (!validImageSizeResult.Item1)
            {
                return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
            }
            product.ImageName = await _imageSaver.SaveImage(product.ImageFile, "images\\products");

            await _productService.Add(product);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Edit([FromForm] ProductDTO product)
        {
            var oldProduct = await _productService.GetById(product.Id);
            if (oldProduct == null)
            {
                throw new Exception($"Product with id {product.Id} not found");
            }
            string imageFileName = oldProduct.ImageName;

            if (product.ImageFile != null)
            {
                var validImageSizeResult = _imageFileSizeValidator.IsValidSize(product.ImageFile);
                if (!validImageSizeResult.Item1)
                {
                    return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
                }

                imageFileName = await _imageSaver.SaveImage(product.ImageFile, "images\\products");
                _imageDeleter.DeleteImage(oldProduct.ImageName, "images\\products");                
            }
            product.ImageName = imageFileName;

            await _productService.Update(product);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var oldProduct = await _productService.GetById(id);
            if (oldProduct == null)
            {
                throw new Exception($"Product with id {id} not found");
            }
            _imageDeleter.DeleteImage(oldProduct.ImageName, "images\\products");

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
