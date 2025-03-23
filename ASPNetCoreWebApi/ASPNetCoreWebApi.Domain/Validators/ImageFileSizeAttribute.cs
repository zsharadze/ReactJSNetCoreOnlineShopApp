using ASPNetCoreWebApi.Domain.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Validators
{
    public class ImageFileSizeValidatorAttribute : ValidationAttribute
    {
        private IConfiguration _configuration;
        private double _maxImageUploadSizeMb;
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            _configuration = (IConfiguration)validationContext.GetService(typeof(IConfiguration));
            _maxImageUploadSizeMb = Convert.ToDouble(_configuration["MaximumUploadImageSizeInMb"]);
            if (value is IFormFile imageFile)
            {
                if (imageFile != null && !IsValidSize(imageFile.Length))
                {
                    return new ValidationResult($"Image file size must be less than {Convert.ToInt32(_maxImageUploadSizeMb)}mb");
                }
            }
            return ValidationResult.Success;
        }

        private bool IsValidSize(long fileLength)
        {
            return (fileLength / 1048576d) < _maxImageUploadSizeMb;
        }
    }
}
