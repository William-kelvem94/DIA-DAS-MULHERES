from PIL import Image
import os, re

folder = 'FOTOS MOZINHO'
for root, dirs, files in os.walk(folder):
    for f in files:
        if re.search(r'\.jpe?g$', f, re.I):
            path = os.path.join(root, f)
            out = re.sub(r'\.jpe?g$', '.webp', path, flags=re.I)
            try:
                img = Image.open(path)
                img.save(out, 'WEBP', quality=70, optimize=True)
                print('converted', path)
            except Exception as e:
                print('failed', path, e)
