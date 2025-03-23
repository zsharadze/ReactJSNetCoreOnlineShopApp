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
        private readonly IImageSaver _imageSaver;
        private readonly IImageDeleter _imageDeleter;
        public ProductController(IProductService productService,
            IImageSaver imageSaver,
            IImageDeleter imageDeleter)
        {
            _productService = productService;
            _imageSaver = imageSaver;
            _imageDeleter = imageDeleter;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ProductsDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(int? categoryId, string searchText, int pageIndex = 1, int pageSize = 10)
        {
            return Ok(await _productService.GetAllItems(categoryId, searchText, pageIndex, pageSize));
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<ProductDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllByIds(List<int> ids)
        {
            return Ok(await _productService.GetAllByIds(ids));
        }

        [HttpGet]
        [ProducesResponseType(typeof(ProductDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> Details(int id)
        {
            return Ok(await _productService.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Create([FromForm] ProductDTO product)
        {
            product.ImageName = await _imageSaver.SaveImage(product.ImageFile, "images\\products");

            await _productService.Add(product);
            return Ok();
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
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
                imageFileName = await _imageSaver.SaveImage(product.ImageFile, "images\\products");
                _imageDeleter.DeleteImage(oldProduct.ImageName, "images\\products");
            }
            product.ImageName = imageFileName;

            await _productService.Update(product);
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int id)
        {
            var oldProduct = await _productService.GetById(id);
            if (oldProduct == null)
            {
                throw new Exception($"Product with id {id} not found");
            }
            _imageDeleter.DeleteImage(oldProduct.ImageName, "images\\products");

            await _productService.Remove(id);
            return Ok();
        }
    }
}
