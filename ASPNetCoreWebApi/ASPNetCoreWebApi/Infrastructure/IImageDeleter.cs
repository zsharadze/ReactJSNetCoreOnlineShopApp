namespace ASPNetCoreWebApi.Infrastructure
{
    public interface IImageDeleter
    {
        void DeleteImage(string fileName, string folderPath);
    }
}
