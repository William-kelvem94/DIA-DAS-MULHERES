import hashlib, os, re, shutil

# compute hash of file

def hash_file(path):
    h = hashlib.sha1()
    with open(path,'rb') as f:
        while True:
            buf=f.read(8192)
            if not buf: break
            h.update(buf)
    return h.hexdigest()[:8]

files = ['style.css','app.js']
newnames = {}
hashes = []
for f in files:
    if os.path.exists(f):
        h = hash_file(f)
        hashes.append(h)
        base,ext=os.path.splitext(f)
        new = f"{base}.{h}{ext}"
        shutil.copy2(f,new)
        newnames[f]=new
        print(f"hashed {f} -> {new}")

version = '-'.join(hashes)

# update index.html
html = open('index.html','r',encoding='utf-8').read()
for orig,new in newnames.items():
    html = re.sub(rf"\b{orig}\b", new, html)
open('index.html','w',encoding='utf-8').write(html)
print('index.html updated')

# update sw.js caching list and version placeholder
if os.path.exists('sw.js'):
    sw = open('sw.js','r',encoding='utf-8').read()
    sw = sw.replace('__CACHE_VERSION__', version)
    for orig,new in newnames.items():
        sw = sw.replace(orig, new)
    open('sw.js','w',encoding='utf-8').write(sw)
    print('sw.js updated')
