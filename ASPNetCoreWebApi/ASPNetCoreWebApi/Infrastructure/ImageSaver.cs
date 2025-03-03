namespace ASPNetCoreWebApi.Infrastructure
{
    public class ImageSaver
    {
        private readonly IWebHostEnvironment _env;

        public ImageSaver(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveImage(IFormFile file, string folderPath)
        {
            if (file != null && file.Length > 0)
            {
                var fileExt = Path.GetExtension(file.FileName);
                var fileName = Guid.NewGuid().ToString() + fileExt;
                var filePath = Path.Combine(_env.WebRootPath, folderPath, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                return fileName;
            }
            return null;
        }
    }
}
