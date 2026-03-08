import os
import zipfile

# This script packages the entire site into a single zip file named offline.zip.
# It includes every file that a visitor would need to view the page locally:
# HTML, CSS, JS, manifest, service worker, music, and all photos. The output
# can be opened on any computer and a copy of index.html in the root will load
# the page without relying on GitHub Pages.

EXCLUDE_DIRS = {".git", "scripts"}  # we don't want the scripts themselves
OUTPUT = "offline.zip"

root = os.path.abspath(os.path.dirname(__file__) + os.sep + "..")

with zipfile.ZipFile(os.path.join(root, OUTPUT), "w", zipfile.ZIP_DEFLATED) as z:
    for dirpath, dirnames, filenames in os.walk(root):
        # skip excluded directories
        rel = os.path.relpath(dirpath, root)
        if any(rel.startswith(d) for d in EXCLUDE_DIRS):
            continue
        for fname in filenames:
            # ignore python scripts and other dev files
            if fname.endswith(".py") or fname.endswith(".md"):
                continue
            full = os.path.join(dirpath, fname)
            arcname = os.path.relpath(full, root)
            z.write(full, arcname)
    # include webp images as well if not copied already (walk above will include them)

print(f"Offline bundle created: {OUTPUT}")
