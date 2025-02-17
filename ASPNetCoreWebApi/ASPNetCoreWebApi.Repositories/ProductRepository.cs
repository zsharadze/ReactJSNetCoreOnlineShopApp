using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using ASPNetCoreWebApi.Domain.Dtos;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Repositories
{
    public class ProductRepository : IProductRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> Add(Product newItem)
        {
            _context.Products.Add(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageSize, int pageIndex)
        {
            var result = new ProductsDTO();
            result.ProductList = new List<ProductDTO>();

            var products = _context.Products.AsNoTracking().Include(x => x.Category).Include(x => x.OrderItems).AsQueryable();
            string summaryTextAdd = "";

            if (categoryId != null || searchText != null)
            {
                summaryTextAdd = $" (filtered from {products.Count()} total entries)";
            }

            if (categoryId != null)
            {
                products = products.Where(x => x.CategoryId == categoryId);
            }

            products = products.OrderBy(x => x.Name);

            if (searchText != null)
            {
                products = products.Where(x => x.Name.ToLower().Contains(searchText.ToLower())
                || x.Description.ToLower().Contains(searchText.ToLower()));
            }

            int totalCount = await products.CountAsync();
            PagerHelper pagerHelper = new PagerHelper(totalCount, pageIndex, pageSize, summaryTextAdd);
            result.Pager = pagerHelper.GetPager;
            result.ProductList = await products.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize).
                Take(pagerHelper.PageSize).
                Select(p => new ProductDTO
                {
                    CategoryId = p.CategoryId,
                    CreatedDate = p.CreatedDate,
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    ImageSrc = p.ImageSrc,
                    Price = p.Price,
                    CategoryName = p.Category.Name,
                    OrdersCount = p.OrderItems.Count()
                }).
                ToListAsync();
            return result;
        }

        public async Task<List<ProductDTO>> GetAllByIds(List<int> ids)
        {
            var products = await _context.Products.AsNoTracking()
                .Where(x => ids.Contains(x.Id))
                .Select(p => new ProductDTO
                {
                    CategoryId = p.CategoryId,
                    CreatedDate = p.CreatedDate,
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    ImageSrc = p.ImageSrc,
                    Price = p.Price
                })
                .ToListAsync();
            return products;
        }

        public async Task<Product> GetById(int id)
        {
            return await _context.Products.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> Remove(int id)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                Product entity = await _context.Products.SingleOrDefaultAsync(a => a.Id == id);
                if (entity != null)
                {
                    var ordersToDelete = _context.OrderItems.Include(x => x.Order)
                        .Where(x => x.ProductId == entity.Id)
                        .Select(x => x.Order);

                    if (ordersToDelete.Any())
                    {
                        _context.Orders.RemoveRange(ordersToDelete);
                        await _context.SaveChangesAsync();
                    }

                    _context.Products.Remove(entity);

                    await _context.SaveChangesAsync();
                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return true;
        }

        public async Task<Product> Update(Product item)
        {
            var existing = await _context.Products.AsNoTracking().SingleOrDefaultAsync(a => a.Id == item.Id);
            if (existing != null)
            {
                item.CreatedDate = existing.CreatedDate;
                _context.Products.Update(item);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }
            else
            {
                throw new Exception($"product with id: {item.Id} not found.");
            }

            return existing;
        }

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}
