using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Infrastructure;
using ASPNetCoreWebApi.BindingModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ASPNetCoreWebApi.Domain.Models;
using AutoMapper;
using ASPNetCoreWebApi.Domain.Services;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly ImageFileSizeValidator _imageFileSizeValidator;
        private readonly ImageSaver _imageSaver;
        private readonly ImageDeleter _imageDeleter;

        public CategoryController(ICategoryService categoryService,
            ImageFileSizeValidator imageFileSizeValidator,
            IMapper mapper,
            ImageSaver imageSaver,
            ImageDeleter imageDeleter)
        {
            _categoryService = categoryService;
            _imageFileSizeValidator = imageFileSizeValidator;
            _imageSaver = imageSaver;
            _imageDeleter = imageDeleter;
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
        public async Task<IActionResult> Create([FromForm] CategoryDTO category)
        {

            if (string.IsNullOrEmpty(category.FaClass) && category.ImageFile == null && string.IsNullOrEmpty(category.ImageName))
            {
                throw new Exception("FaClass and ImageFile both can't be null");
            }

            if (category.ImageFile != null)
            {
                var validImageSizeResult = _imageFileSizeValidator.IsValidSize(category.ImageFile);
                if (!validImageSizeResult.Item1)
                {
                    return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
                }
            }

            category.ImageName = await _imageSaver.SaveImage(category.ImageFile, "images\\categories");

            await _categoryService.Add(category);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Edit([FromForm] CategoryDTO category)
        {
            if (string.IsNullOrEmpty(category.FaClass) && category.ImageFile == null && string.IsNullOrEmpty(category.ImageName))
            {
                throw new Exception("FaClass and ImageFile both can't be null");
            }

            var oldCategory = await _categoryService.GetById(category.Id);
            if (oldCategory == null)
            {
                throw new Exception($"Category with id {category.Id} not found");
            }
            string imageFileName = oldCategory.ImageName;

            if (category.ImageFile != null)
            {
                var validImageSizeResult = _imageFileSizeValidator.IsValidSize(category.ImageFile);
                if (!validImageSizeResult.Item1)
                {
                    return Ok(new ApiResponse() { Success = false, Message = validImageSizeResult.Item2 });
                }

                imageFileName = await _imageSaver.SaveImage(category.ImageFile, "images\\categories");
                _imageDeleter.DeleteImage(oldCategory.ImageName, "images\\categories");
            }

            if (!string.IsNullOrEmpty(category.FaClass))
            {
                _imageDeleter.DeleteImage(oldCategory.ImageName, "images\\categories");
                imageFileName = null;
            }
            category.ImageName = imageFileName;

            await _categoryService.Update(category);
            return Ok(new ApiResponse() { Success = true, Message = "" });
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ApiResponse), 200)]
        public async Task<IActionResult> Delete(int id)
        {
            var oldCategory = await _categoryService.GetById(id);
            if (oldCategory == null)
            {
                throw new Exception($"Category with id {id} not found");
            }
            _imageDeleter.DeleteImage(oldCategory.ImageName, "images\\categories");

            var success = await _categoryService.Remove(id);
            if (success)
                return Ok(new ApiResponse() { Success = true, Message = "" });
            else
                return Ok(new ApiResponse() { Success = false, Message = "Unhandled exception occured." });
        }
    }
}