using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Infrastructure;
using ASPNetCoreWebApi.BindingModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ASPNetCoreWebApi.Domain.Models;
using AutoMapper;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly ImageFileSizeValidator _imageFileSizeValidator;

        public CategoryController(ICategoryService categoryService,
            ImageFileSizeValidator imageFileSizeValidator,
            IMapper mapper)
        {
            _categoryService = categoryService;
            _imageFileSizeValidator = imageFileSizeValidator;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CategoriesDTO), 200)]
        public async Task<IActionResult> GetAll(string searchText = null, int? pageSize = null, int? pageIndex = 1)
        {
            return Ok(await _categoryService.GetAllItems(searchText, pageSize, pageIndex));
        }

        [HttpGet]
        [ProducesResponseType(typeof(CategoryDTO), 200)]
        public async Task<IActionResult> Details(int id)
        {
            return Ok(await _categoryService.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Create([FromBody] CategoryDTO category)
        {
            if (string.IsNullOrEmpty(category.FaClass) && string.IsNullOrEmpty(category.ImageSrc))
            {
                throw new Exception("FaClass and ImageSrc both can't be null");
            }

            if (!string.IsNullOrEmpty(category.ImageSrc))
            {
                var validImageSizeResult = _imageFileSizeValidator.IsValidSize(category.ImageSrc);
                if (!validImageSizeResult.Item1)
                {
                    return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
                }
            }
            await _categoryService.Add(category);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Edit([FromBody] CategoryDTO category)
        {
            if (!string.IsNullOrEmpty(category.ImageSrc))
            {
                var validImageSizeResult = _imageFileSizeValidator.IsValidSize(category.ImageSrc);
                if (!validImageSizeResult.Item1)
                {
                    return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
                }
            }
            await _categoryService.Update(category);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _categoryService.Remove(id);
            if (success)
                return Ok(new ApiResponse() { Success = true, Message = "" });
            else
                return Ok(new ApiResponse() { Success = false, Message = "Unhandled exception occured." });
        }
    }
}