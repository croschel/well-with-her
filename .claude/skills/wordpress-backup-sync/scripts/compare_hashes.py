"""Compare docs/wordpress/backup/ files with the live hashes printed by live-hashes.js.

Usage: python3 compare_hashes.py '<json from live-hashes.js>'

Backup files end with one trailing newline that WordPress doesn't store, so it's stripped before
hashing. Exits 1 if any file differs or is missing.
"""

import hashlib
import json
import pathlib
import sys

BACKUP = pathlib.Path(__file__).resolve().parents[4] / "docs" / "wordpress" / "backup"

live = json.loads(sys.argv[1])
bad = 0
for name, want in sorted(live.items()):
    path = BACKUP / name
    if not path.exists():
        print(f"MISSING {name}")
        bad += 1
        continue
    got = hashlib.sha256(path.read_text(encoding="utf-8").rstrip("\n").encode()).hexdigest()
    ok = got == want
    bad += not ok
    print(f"{'OK  ' if ok else 'DIFF'} {name}")
sys.exit(1 if bad else 0)
