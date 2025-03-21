using ASPNetCoreWebApi.Domain.Extensions;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CategoriesDTO
    {
        public List<CategoryForListDTO> CategoryList { get; set; }
        public Pager Pager { get; set; }
    }

    public class CategoryForListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FaClass { get; set; }//font awsome 4.7.0 class: "fa fa-desktop" for example
        public string ImageName { get; set; }
        public int ProductsCount { get; set; }
    }
}
