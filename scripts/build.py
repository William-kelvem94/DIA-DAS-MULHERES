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

# list of source files relative to workspace root
files = ['css/style.css', 'js/app.js']
newnames = {}
hashes = []
for f in files:
    if os.path.exists(f):
        h = hash_file(f)
        hashes.append(h)
        dirname, basename = os.path.split(f)
        base, ext = os.path.splitext(basename)
        newbasename = f"{base}.{h}{ext}"
        newpath = os.path.join(dirname, newbasename)
        shutil.copy2(f, newpath)
        newnames[f] = newpath
        print(f"hashed {f} -> {newpath}")

version = '-'.join(hashes)

# update index.html
html_path = 'index.html'
html = open(html_path,'r',encoding='utf-8').read()
for orig, new in newnames.items():
    # orig appears in index without directory prefix when referenced earlier
    # but now assets are referenced with dir prefix; ensure we replace accordingly.
    html = re.sub(rf"\b{re.escape(orig)}\b", new, html)
    # also replace basename occurrences if any
    base = os.path.basename(orig)
    html = re.sub(rf"\b{re.escape(base)}\b", new, html)
open(html_path,'w',encoding='utf-8').write(html)
print('index.html updated')

# update service worker
sw_path = 'scripts/sw.js'
if os.path.exists(sw_path):
    sw = open(sw_path,'r',encoding='utf-8').read()
    sw = sw.replace('__CACHE_VERSION__', version)
    # build a fresh urlsToCache list: keep static entries and insert hashed css/js
    urls = ["/", "/index.html"]
    for orig,new in newnames.items():
        # convert path to leading-slash form
        urls.append('/' + new.replace('\\','/'))
    # preserve any other hardcoded assets (like mp3) already in sw.js
    # find existing non-js/css entries
    extra = []
    for line in sw.splitlines():
        m = re.match(r"\s*'(.+)'", line)
        if m:
            val = m.group(1)
            if not any(val.endswith(os.path.basename(n)) for n in newnames.values()):
                if val not in urls:
                    extra.append(val)
    urls.extend(extra)
    # reconstruct the array block
    arr = "const urlsToCache = [\n"
    for u in urls:
        arr += f"  '{u}',\n"
    arr += "];"
    # replace old block
    sw = re.sub(r"const urlsToCache = \[[\s\S]*?\];", arr, sw)
    open(sw_path,'w',encoding='utf-8').write(sw)
    print('sw.js updated')
