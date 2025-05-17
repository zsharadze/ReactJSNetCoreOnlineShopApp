using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string ImageName { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
