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
    # use forward slashes for HTML paths
    new_url = new.replace('\\', '/')
    orig_url = orig.replace('\\', '/')
    # Replace the actual asset path with the hashed version
    html = html.replace(orig_url, new_url)
    # Also handle references without dir prefix if they exist
    base = os.path.basename(orig)
    new_base = os.path.basename(new)
    html = html.replace(base, new_base)

open(html_path,'w',encoding='utf-8').write(html)
print('index.html updated')

# update service worker (and move it to root)
sw_src = 'scripts/sw.js'
sw_dest = 'sw.js'
if os.path.exists(sw_src):
    sw = open(sw_src,'r',encoding='utf-8').read()
    sw = sw.replace("REPLACE_ME", f"{version}-{int(os.path.getmtime(sw_src))}")
    # Relative paths for GitHub Pages subfolder compatibility
    # Relative paths for GitHub Pages subfolder compatibility
    urls = ["index.html", "./"]
    for orig,new in newnames.items():
        urls.append(new.replace('\\','/'))
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
    # ensure MP3 is cached correctly without leading slash
    if 'assets/music/music.mp3' not in urls:
        urls.append('assets/music/music.mp3')
    
    # reconstruct the array block
    arr = "const urlsToCache = [\n"
    for u in urls:
        arr += f"  '{u}',\n"
    arr += "];"
    # replace old block
    sw = re.sub(r"const urlsToCache = \[[\s\S]*?\];", arr, sw)
    open(sw_dest,'w',encoding='utf-8').write(sw)
    print('sw.js updated and moved to root')
