import qrcode
from PIL import Image, ImageDraw

# generate a QR code with custom colors
url = 'https://william-kelvem94.github.io/DIA-DAS-MULHERES/'
qr = qrcode.QRCode(
    version=3,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# make the image
img = qr.make_image(fill_color="#880e4f", back_color="white").convert("RGBA")

# add rounded corners by masking
w, h = img.size
radius = 40
mask = Image.new("L", (w, h), 0)
draw = ImageDraw.Draw(mask)
draw.rounded_rectangle((0, 0, w, h), radius=radius, fill=255)
img.putalpha(mask)

# add colored circular background behind
bg = Image.new("RGBA", (w + 20, h + 20), (255, 255, 255, 0))
bg_draw = ImageDraw.Draw(bg)
bg_draw.rounded_rectangle((0, 0, w + 20, h + 20), radius=radius + 10, fill=(255, 255, 255, 255))
bg.paste(img, (10, 10), img)

# save final
bg.save('qrcode.png')
print('qrcode.png saved with styling')
