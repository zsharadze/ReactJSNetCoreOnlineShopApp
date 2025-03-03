namespace ASPNetCoreWebApi.Infrastructure
{
    public class ImageDeleter
    {
        private readonly IWebHostEnvironment _env;

        public ImageDeleter(IWebHostEnvironment env)
        {
            _env = env;
        }

        public void DeleteImage(string fileName, string folderPath)
        {
            if (string.IsNullOrEmpty(fileName) || !File.Exists(Path.Combine(_env.WebRootPath, folderPath, fileName)))
                return;
            try
            {
                var filePath = Path.Combine(_env.WebRootPath, folderPath, fileName);
                File.Delete(filePath);
            }
            catch
            {
                throw;
            }
        }
    }
}
