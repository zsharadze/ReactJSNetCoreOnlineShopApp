using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Models
{
    public class Product
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Precision(18, 2)]
        public decimal Price { get; set; }
        [Required]
        public string ImageName { get; set; }//base 64
        public DateTime CreatedDate { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}
