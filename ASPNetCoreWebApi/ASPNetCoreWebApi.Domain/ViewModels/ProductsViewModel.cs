using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class ProductsViewModel
    {
        public List<Product> ProductList { get; set; }
        public Pager Pager { get; set; }
    }
}
