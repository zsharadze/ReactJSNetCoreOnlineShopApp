using ASPNetCoreWebApi.Domain.Extensions;
using ASPNetCoreWebApi.Domain.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class OrdersDTO
    {
        public List<OrderForListDto> OrderList { get; set; }
        public Pager Pager { get; set; }
    }

    public class OrderForListDto
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsShipped { get; set; }
        public decimal Subtotal { get; set; }
        public decimal? SubtotalWithPromo { get; set; }
        public string UserId { get; set; }
        public string UserEmail { get; set; }
        public int? PromoCodeId { get; set; }
        public virtual PromoCodeDTO PromoCode { get; set; }
        public ICollection<OrderItemDTO> OrderItems { get; set; }
    }
}
