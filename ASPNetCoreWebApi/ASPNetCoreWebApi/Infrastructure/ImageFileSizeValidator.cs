namespace ASPNetCoreWebApi.Infrastructure
{
    public class ImageFileSizeValidator
    {
        private readonly IConfiguration _config;
        private double _maxImageUploadSizeMb;

        public ImageFileSizeValidator(IConfiguration configuration)
        {
            _config = configuration;
            _maxImageUploadSizeMb = Convert.ToDouble(_config["MaximumUploadImageSizeInMb"]);
        }

        public (bool, string) IsValidSize(string base64ImgString)
        {
            byte[] imageBytes = Convert.FromBase64String(base64ImgString);
            long size = imageBytes.Length;
            // Maximum file size allowed in mb
            bool isValidSize = (size / 1048576d) < _maxImageUploadSizeMb;
            return (isValidSize, (!isValidSize ? $"Image file size must be less than {Convert.ToInt32(_maxImageUploadSizeMb)}mb" : null));
        }
    }
}
