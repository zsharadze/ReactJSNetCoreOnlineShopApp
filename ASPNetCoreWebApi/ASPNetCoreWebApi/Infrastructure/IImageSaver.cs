namespace ASPNetCoreWebApi.Infrastructure
{
    public interface IImageSaver
    {
        Task<string> SaveImage(IFormFile file, string folderPath);
    }
}
