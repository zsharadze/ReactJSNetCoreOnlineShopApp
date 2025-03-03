using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.BindingModels;
using ASPNetCoreWebApi.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Infrastructure
{
    public static class SeederExtension
    {
        public static IHost SeedDatabase<TContext>(this IHost host) where TContext : ApplicationDbContext
        {
            //Create a scope to get scoped services.
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetService<TContext>();
                context.Database.Migrate();

                if (!context.Categories.Any() && !context.Products.Any())
                {

                    //insert categories
                    Category categoryDesktop = new Category();
                    categoryDesktop.Name = "Desktops";
                    categoryDesktop.FaClass = "fa fa-desktop";
                    context.Categories.Add(categoryDesktop);

                    Category categoryLaptop = new Category();
                    categoryLaptop.Name = "Laptops";
                    categoryLaptop.FaClass = "fa fa-laptop";
                    context.Categories.Add(categoryLaptop);

                    Category categoryTablet = new Category();
                    categoryTablet.Name = "Tablets";
                    categoryTablet.FaClass = "fa fa-tablet";
                    context.Categories.Add(categoryTablet);
                    //

                    context.SaveChanges();

                    //insert desktop pcs.
                    Product desktop1 = new Product();
                    desktop1.CategoryId = categoryDesktop.Id;
                    desktop1.Name = "i3 10100";
                    desktop1.Description = "RAM: 8GB, SSD: 256GB, GPU: GTX 1050, PSU: 500w";
                    desktop1.Price = 400;
                    desktop1.ImageName = "Desktop1.jpg";
                    desktop1.CreatedDate = DateTime.Now;
                    context.Products.Add(desktop1);


                    Product desktop2 = new Product();
                    desktop2.CategoryId = categoryDesktop.Id;
                    desktop2.Name = "Intel Core i3-10100f";
                    desktop2.Description = "RAM: 16GB, SSD: 500GB, GPU: GTX 1070 , PSU: 700w";
                    desktop2.Price = 800;
                    desktop2.ImageName = "Desktop2.jpg";
                    desktop2.CreatedDate = DateTime.Now;
                    context.Products.Add(desktop2);

                    Product desktop3 = new Product();
                    desktop3.CategoryId = categoryDesktop.Id;
                    desktop3.Name = "Intel Core i5-11600K";
                    desktop3.Description = "RAM: 32GB, SSD: 500GB, GPU: GTX 1080 TI , PSU: 850w";
                    desktop3.Price = 1000;
                    desktop3.ImageName = "Desktop3.jpg";
                    desktop3.CreatedDate = DateTime.Now;
                    context.Products.Add(desktop3);

                    Product desktop4 = new Product();
                    desktop4.CategoryId = categoryDesktop.Id;
                    desktop4.Name = "Intel Core i3-9100f";
                    desktop4.Description = "RAM: 16GB, SSD: 120GB, HDD: 500GB, GPU: GTX 1050 TI , PSU: 650w";
                    desktop4.Price = 700;
                    desktop4.ImageName = "Desktop4.jpg";
                    desktop4.CreatedDate = DateTime.Now;
                    context.Products.Add(desktop4);

                    Product desktop5 = new Product();
                    desktop5.CategoryId = categoryDesktop.Id;
                    desktop5.Name = "AMD Ryzen 9 5900X";
                    desktop5.Description = "RAM: 64GB, SSD: 2TB, HDD: 2TB, GPU: RX 6700 XT , PSU: 1200w";
                    desktop5.Price = 2000;
                    desktop5.ImageName = "Desktop5.jpg";
                    desktop5.CreatedDate = DateTime.Now;
                    context.Products.Add(desktop5);
                    //

                    //insert laptops
                    Product laptop1 = new Product();
                    laptop1.CategoryId = categoryLaptop.Id;
                    laptop1.Name = "i7-11370H";
                    laptop1.Description = "RAM: 32GB, SSD: 500GB, GPU: NVIDA GeForce MX450, Display: 15.6 Inch";
                    laptop1.Price = 870;
                    laptop1.ImageName = "Laptop1.jpg";
                    laptop1.CreatedDate = DateTime.Now;
                    context.Products.Add(laptop1);

                    Product laptop2 = new Product();
                    laptop2.CategoryId = categoryLaptop.Id;
                    laptop2.Name = "AMD Ryzen 5 5600H";
                    laptop2.Description = "RAM: 16GB, SSD: 256GB, GPU: NVIDIA GeForce GTX 1650, Display: 15.6 Inch";
                    laptop2.Price = 700;
                    laptop2.ImageName = "Laptop2.jpg";
                    laptop2.CreatedDate = DateTime.Now;
                    context.Products.Add(laptop2);

                    Product laptop3 = new Product();
                    laptop3.CategoryId = categoryLaptop.Id;
                    laptop3.Name = "Intel Core i5-10300H";
                    laptop3.Description = "RAM: 8GB, SSD: 256GB, GPU: GeForce RTX 3050, Display: 15.6 Inch";
                    laptop3.Price = 1100;
                    laptop3.ImageName = "Laptop3.jpg";
                    laptop3.CreatedDate = DateTime.Now;
                    context.Products.Add(laptop3);

                    Product laptop4 = new Product();
                    laptop4.CategoryId = categoryLaptop.Id;
                    laptop4.Name = "Intel Core i5-1035G1";
                    laptop4.Description = "RAM: 16GB, SSD: 500GB, GPU: Integrated, Display: 14 Inch";
                    laptop4.Price = 1100;
                    laptop4.ImageName = "Laptop4.jpg";
                    laptop4.CreatedDate = DateTime.Now;
                    context.Products.Add(laptop4);

                    Product laptop5 = new Product();
                    laptop5.CategoryId = categoryLaptop.Id;
                    laptop5.Name = "Intel Core i5-10210U";
                    laptop5.Description = "RAM: 8GB, SSD: 256GB, GPU: Integrated, Display: 13 Inch";
                    laptop5.Price = 1100;
                    laptop5.ImageName = "Laptop5.jpg";
                    laptop5.CreatedDate = DateTime.Now;
                    context.Products.Add(laptop5);
                    //

                    //insert tablets
                    Product tablet1 = new Product();
                    tablet1.CategoryId = categoryTablet.Id;
                    tablet1.Name = "Tablet 10.1";
                    tablet1.Description = "RAM: 3GB, Storage: 32GB, Battery: 12 Hour, Display: 10.1 Inch";
                    tablet1.Price = 255;
                    tablet1.ImageName = "Tablet1.jpg";
                    tablet1.CreatedDate = DateTime.Now;
                    context.Products.Add(tablet1);

                    Product tablet2 = new Product();
                    tablet2.CategoryId = categoryTablet.Id;
                    tablet2.Name = "Tablet 7";
                    tablet2.Description = "RAM: 1.5GB, Storage: 16GB, Battery: 6 Hour, Display: 7 Inch";
                    tablet2.Price = 150;
                    tablet2.ImageName = "Tablet2.jpg";
                    tablet2.CreatedDate = DateTime.Now;
                    context.Products.Add(tablet2);

                    Product tablet3 = new Product();
                    tablet3.CategoryId = categoryTablet.Id;
                    tablet3.Name = "Tablet 10.0";
                    tablet3.Description = "RAM: 1GB, Storage: 8GB, Battery: 4 Hour, Display: 10.0 Inch";
                    tablet3.Price = 200;
                    tablet3.ImageName = "Tablet3.jpg";
                    tablet3.CreatedDate = DateTime.Now;
                    context.Products.Add(tablet3);

                    Product tablet4 = new Product();
                    tablet4.CategoryId = categoryTablet.Id;
                    tablet4.Name = "Tablet 11.6";
                    tablet4.Description = "RAM: 4GB, Storage: 64GB, Battery: 10 Hour, Display: 11.6 Inch";
                    tablet4.Price = 310;
                    tablet4.ImageName = "Tablet4.jpg";
                    tablet4.CreatedDate = DateTime.Now;
                    context.Products.Add(tablet4);

                    Product tablet5 = new Product();
                    tablet5.CategoryId = categoryTablet.Id;
                    tablet5.Name = "Tablet 8";
                    tablet5.Description = "RAM: 4GB, Storage: 64GB, Battery: 8 Hour, Display: 8 Inch";
                    tablet5.Price = 270;
                    tablet5.ImageName = "Tablet5.jpg";
                    tablet5.CreatedDate = DateTime.Now;
                    context.Products.Add(tablet5);
                    //

                    context.SaveChanges();
                }

                string[] roles = new string[] { UserRoles.Admin, UserRoles.User };

                foreach (string role in roles)
                {
                    var roleStore = new RoleStore<IdentityRole>(context);

                    if (!context.Roles.Any(r => r.Name == role))
                    {
                        var res = roleStore.CreateAsync(new IdentityRole() { Name = role, NormalizedName = role }).Result;
                    }
                }

                context.SaveChanges();
            }

            return host;
        }
    }
}