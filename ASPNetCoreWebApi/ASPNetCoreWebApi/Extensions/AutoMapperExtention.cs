using AutoMapper;
using System.Reflection;

namespace ASPNetCoreWebApi.Extensions
{
    public static class AutoMapperExtention
    {
        public static IMappingExpression<TSource, TDestination>
            IgnoreAllUnmapped<TSource, TDestination>(this IMappingExpression<TSource, TDestination> expression)
        {
            Type type = typeof(TSource);
            PropertyInfo[] properties = typeof(TDestination).GetProperties(BindingFlags.Instance | BindingFlags.Public);
            foreach (PropertyInfo propertyInfo in properties)
            {
                if (type.GetProperty(propertyInfo.Name, BindingFlags.Instance | BindingFlags.Public) == null)
                {
                    expression.ForMember(propertyInfo.Name, opt => opt.Ignore());
                }
            }

            return expression;
        }
    }
}