using ASPNetCoreWebApi.Domain.Validators;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageName { get; set; }
        [ImageFileSizeValidator]
        public IFormFile ImageFile { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CategoryName { get; set; }
        public int OrdersCount { get; set; }
    }
}
