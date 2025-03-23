using ASPNetCoreWebApi.Domain.Dtos;
using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Validators
{
    //validator to check if either faClass field or imageName field has value
    public class FaClassAndImageRequiredValidatorAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var errorMessage = "FaClass and Image both can't be null.";
            if (validationContext.ObjectInstance is CategoryDTO categoryDto && string.IsNullOrWhiteSpace(categoryDto.FaClass) && string.IsNullOrWhiteSpace(categoryDto.ImageName) && categoryDto.ImageFile == null)
                return new ValidationResult(errorMessage);
            return ValidationResult.Success;
        }
    }
}
