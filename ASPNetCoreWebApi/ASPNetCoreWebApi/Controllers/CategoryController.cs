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
        private readonly IImageSaver _imageSaver;
        private readonly IImageDeleter _imageDeleter;

        public CategoryController(ICategoryService categoryService,           
            IMapper mapper,
            IImageSaver imageSaver,
            IImageDeleter imageDeleter)
        {
            _categoryService = categoryService;
            _imageSaver = imageSaver;
            _imageDeleter = imageDeleter;
        }

        [HttpGet]
        [ProducesResponseType(typeof(CategoriesDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string searchText = null, int? pageIndex = 1, int? pageSize = null)
        {
            return Ok(await _categoryService.GetAllItems(searchText, pageIndex, pageSize));
        }

        [HttpGet]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> Details(int id)
        {
            return Ok(await _categoryService.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Create([FromForm] CategoryDTO category)
        {
            category.ImageName = await _imageSaver.SaveImage(category.ImageFile, "images\\categories");
            await _categoryService.Add(category);
            return Ok();
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Edit([FromForm] CategoryDTO category)
        {
            var oldCategory = await _categoryService.GetById(category.Id);
            if (oldCategory == null)
            {
                throw new Exception($"Category with id {category.Id} not found");
            }
            string imageFileName = oldCategory.ImageName;

            if (category.ImageFile != null)
            {
                imageFileName = await _imageSaver.SaveImage(category.ImageFile, "images\\categories");
                _imageDeleter.DeleteImage(oldCategory.ImageName, "images\\categories");
            }

            category.ImageName = imageFileName;

            await _categoryService.Update(category);
            return Ok();
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int id)
        {
            var oldCategory = await _categoryService.GetById(id);
            if (oldCategory == null)
            {
                throw new Exception($"Category with id {id} not found");
            }
            _imageDeleter.DeleteImage(oldCategory.ImageName, "images\\categories");

            var success = await _categoryService.Remove(id);
            if (!success)
            {
                ModelState.AddModelError("errors", "Can't delete category because there are products attached to it.");
                return BadRequest(ModelState);
            }
            return Ok();
        }
    }
}