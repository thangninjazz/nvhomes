using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace NVHome.Infrastructure.Helpers
{
    public static class ImageHelper
    {
        /// <summary>
        /// Nén và chuyển đổi hình ảnh sang định dạng WebP để tối ưu dung lượng.
        /// </summary>
        /// <param name="inputPath">Đường dẫn file gốc</param>
        /// <param name="outputPath">Đường dẫn file WebP đích</param>
        /// <param name="maxWidth">Chiều rộng tối đa (mặc định 1920px)</param>
        /// <param name="quality">Chất lượng nén 0-100 (mặc định 75)</param>
        public static async Task ConvertToWebP(string inputPath, string outputPath, int maxWidth = 1920, int quality = 75)
        {
            using (var image = await Image.LoadAsync(inputPath))
            {
                // Resize nếu ảnh quá lớn để tối ưu hiển thị
                if (image.Width > maxWidth)
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(maxWidth, 0),
                        Mode = ResizeMode.Max
                    }));
                }

                // Cấu hình encoder WebP
                var encoder = new WebpEncoder
                {
                    Quality = quality,
                    Method = WebpEncodingMethod.BestQuality
                };

                // Lưu ảnh dưới định dạng WebP
                await image.SaveAsync(outputPath, encoder);
            }
        }
    }
}
