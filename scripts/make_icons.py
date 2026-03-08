from PIL import Image, ImageDraw, ImageFilter

def draw_heart(img):
    w,h = img.size
    draw = ImageDraw.Draw(img)
    # draw a more rounded heart using arcs
    r = w * 0.25
    # left circle
    draw.ellipse((w*0.25-r, h*0.2, w*0.25+r, h*0.2+2*r), fill=(255,182,193))
    # right circle
    draw.ellipse((w*0.75-r, h*0.2, w*0.75+r, h*0.2+2*r), fill=(255,182,193))
    # bottom triangle
    draw.polygon([
        (w*0.5, h*0.9),
        (w*0.1, h*0.3),
        (w*0.9, h*0.3)
    ], fill=(255,182,193))
    # blur slightly for softness
    return img.filter(ImageFilter.GaussianBlur(1))

for size,name in [(192,'icon-192.png'),(512,'icon-512.png')]:
    base = Image.new('RGBA',(size,size),(0,0,0,0))
    heart = draw_heart(Image.new('RGBA',(size,size),(236,72,153)))
    base.paste(heart,(0,0),heart)
    base.save(name, optimize=True)
print('icons generated')