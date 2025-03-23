using ASPNetCoreWebApi.Domain.Validators;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [FaClassAndImageRequiredValidator]
        public string FaClass { get; set; }//font awsome 4.7.0 class: "fa fa-desktop" for example
        public string ImageName { get; set; }
        [ImageFileSizeValidator]
        public IFormFile ImageFile { get; set; }
    }
}
