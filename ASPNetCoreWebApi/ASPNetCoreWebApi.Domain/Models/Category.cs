using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Models
{
    public class Category
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string FaClass { get; set; }//font awsome 4.7.0 class: "fa fa-desktop" for example
        public string ImageSrc { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
