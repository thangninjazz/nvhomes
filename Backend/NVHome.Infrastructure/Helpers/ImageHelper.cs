using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.Fonts;
using SixLabors.ImageSharp.Drawing.Processing;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace NVHome.Infrastructure.Helpers
{
    public static class ImageHelper
    {
        private static Font? _cachedFont;
        private static readonly object _fontLock = new object();

        private static Font GetWatermarkFont(float imageWidth)
        {
            if (_cachedFont == null)
            {
                lock (_fontLock)
                {
                    if (_cachedFont == null)
                    {
                        // Thử tìm font hệ thống phổ biến
                        var fontNames = new[] { "DejaVu Sans", "Arial", "Verdana", "FreeSans", "Liberation Sans" };
                        FontFamily family = SystemFonts.Families.FirstOrDefault();
                        
                        foreach (var name in fontNames)
                        {
                            if (SystemFonts.TryGet(name, out var foundFamily))
                            {
                                family = foundFamily;
                                break;
                            }
                        }
                        
                        _cachedFont = family.CreateFont(12, FontStyle.Bold);
                    }
                }
            }

            // Scale font size based on image width (approx 2.5% of width)
            float fontSize = Math.Max(16, imageWidth * 0.025f);
            return _cachedFont.Family.CreateFont(fontSize, FontStyle.Bold);
        }

        /// <summary>
        /// Nén, đóng dấu watermark và chuyển đổi hình ảnh sang định dạng WebP.
        /// </summary>
        public static async Task ConvertToWebP(string inputPath, string outputPath, int maxWidth = 1920, int quality = 75)
        {
            using (var image = await Image.LoadAsync(inputPath))
            {
                // 1. Resize nếu ảnh quá lớn
                if (image.Width > maxWidth)
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(maxWidth, 0),
                        Mode = ResizeMode.Max
                    }));
                }

                // 2. Thêm Watermark (nvhomes.vn - 0966.245.396)
                var font = GetWatermarkFont(image.Width);
                string watermarkText = "nvhomes.vn - 0966.245.396";
                
                var options = new TextOptions(font)
                {
                    HorizontalAlignment = HorizontalAlignment.Right,
                    VerticalAlignment = VerticalAlignment.Bottom,
                };

                // Tính toán vị trí (cách lề 2% chiều rộng/cao)
                float paddingX = image.Width * 0.02f;
                float paddingY = image.Height * 0.02f;
                var position = new PointF(image.Width - paddingX, image.Height - paddingY);

                image.Mutate(x => x.DrawText(
                    options,
                    watermarkText,
                    Color.White.WithAlpha(0.4f), // Độ mờ 40%
                    position
                ));

                // 3. Lưu ảnh dưới định dạng WebP
                var encoder = new WebpEncoder
                {
                    Quality = quality,
                    Method = WebpEncodingMethod.BestQuality
                };

                await image.SaveAsync(outputPath, encoder);
            }
        }
    }
}
