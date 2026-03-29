from PIL import Image
import os

source_path = r"C:\Users\Admin\Downloads\z7670577186907_0bd9316885469ad6def54a8c43278363.jpg"
public_dir = r"c:\Users\Admin\Desktop\NVHome\frontend\public"

if not os.path.exists(public_dir):
    os.makedirs(public_dir)

# Open original
img = Image.open(source_path)

# 1. Save as logo.png (512x512)
logo_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
logo_512.save(os.path.join(public_dir, "logo.png"), "PNG")

# 2. Save as favicon.ico (32x32)
favicon = img.resize((32, 32), Image.Resampling.LANCZOS)
favicon.save(os.path.join(public_dir, "favicon.ico"), "ICO")

print(f"Successfully processed logo and favicon to {public_dir}")
