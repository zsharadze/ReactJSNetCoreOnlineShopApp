using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Repositories
{
    public class CategoryRepository : ICategoryRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> Add(Category newItem)
        {
            if (!string.IsNullOrEmpty(newItem.FaClass))
                newItem.FaClass = newItem.FaClass.Trim();
            _context.Categories.Add(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<CategoriesViewModel> GetAllItems(string searchText, int? pageSize, int? pageIndex)
        {
            var result = new CategoriesViewModel();
            result.CategoryList = new List<CategoryDto>();

            var categories = _context.Categories.AsNoTracking().Include(x => x.Products).Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                FaClass = c.FaClass,
                ImageSrc = c.ImageSrc,
                ProductsCount = c.Products.Count
            }).AsQueryable();
            string summaryTextAdd = "";

            if (searchText != null)
            {
                summaryTextAdd = $" (filtered from {categories.Count()} total entries)";
            }

            categories = categories.OrderBy(x => x.Name);

            if (searchText != null)
            {
                categories = categories.Where(x => x.Name.ToLower().Contains(searchText.ToLower()));
            }

            if (pageSize == null || pageIndex == null)
            {
                result.CategoryList = await categories.ToListAsync();
                return result;
            }
            else if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await categories.CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex.Value, pageSize.Value, summaryTextAdd);
                result.Pager = pagerHelper.GetPager;
                result.CategoryList = await categories.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize).Take(pagerHelper.PageSize).ToListAsync();
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<Category> GetById(int id)
        {
            return await _context.Categories.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> Remove(int id)
        {
            Category entity = await _context.Categories.Include(x => x.Products).SingleOrDefaultAsync(a => a.Id == id);
            if (entity != null)
            {
                if (entity.Products.Any())
                {
                    return false;
                }
                _context.Categories.Remove(entity);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<Category> Update(Category item)
        {
            if (!string.IsNullOrEmpty(item.FaClass))
                item.FaClass = item.FaClass.Trim();
            var existing = await _context.Categories.AsNoTracking().SingleOrDefaultAsync(a => a.Id == item.Id);
            if (existing != null)
            {
                _context.Categories.Update(item);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }

            return existing;
        }

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}