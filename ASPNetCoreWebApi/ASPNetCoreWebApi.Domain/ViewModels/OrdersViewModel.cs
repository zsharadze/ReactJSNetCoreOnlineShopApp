using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.ViewModels
{
    public class OrdersViewModel
    {
        public List<Order> OrderList { get; set; }
        public Pager Pager { get; set; }
    }
}
