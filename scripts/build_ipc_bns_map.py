import re
import json
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw = (ROOT / "ncrb_raw.html").read_text(encoding="utf-8")

m = re.search(r'id="example"[\s\S]*?<tbody>([\s\S]*?)</tbody>', raw, re.I)
if not m:
    raise SystemExit("no tbody")
tbody = m.group(1)
rows = re.findall(r"<tr[^>]*>([\s\S]*?)</tr>", tbody, re.I)
print("rows", len(rows))


def cell_text(td_html: str) -> str:
    t = re.sub(r"<br\s*/?>", "\n", td_html, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


entries = []
chapter = ""
for row in rows:
    tds = re.findall(r"<td[^>]*>([\s\S]*?)</td>", row, re.I)
    if len(tds) < 2:
        continue
    bns_text = cell_text(tds[0])
    ipc_text = cell_text(tds[1])
    if not bns_text and not ipc_text:
        continue

    if "CHAPTER" in bns_text.upper() and not re.match(r"^\d", bns_text):
        chapter = bns_text
        continue

    bns_sec = ""
    bns_title = bns_text
    bm = re.match(r"^(\d{1,3}[A-Z]?(?:\([^)]+\))*)\s*[\.\:\-]?\s*(.*)$", bns_text)
    if bm:
        bns_sec = bm.group(1).strip()
        bns_title = bm.group(2).strip() or bns_text

    ipc_status = "mapped"
    ipc_sec = ""
    ipc_title = ipc_text
    low = ipc_text.lower()
    if low.startswith("deleted") or low == "deleted":
        ipc_status = "deleted"
    elif ("new" in low) and not re.match(r"^\d", ipc_text):
        ipc_status = "new"
        im = re.search(r"(\d{1,3}[A-Z]?(?:\([^)]+\))*)", ipc_text)
        ipc_sec = im.group(1) if im else ""
    else:
        im = re.match(r"^(\d{1,3}[A-Z]?(?:\([^)]+\))*)\s*[\.\:\-]?\s*(.*)$", ipc_text)
        if im:
            ipc_sec = im.group(1).strip()
            ipc_title = im.group(2).strip() or ipc_text
        else:
            im2 = re.search(r"\b(\d{1,3}[A-Z]?)\b", ipc_text)
            if im2:
                ipc_sec = im2.group(1)
            if not ipc_text.strip():
                ipc_status = "none"

    if not bns_sec and not ipc_sec:
        continue

    entries.append(
        {
            "bns": bns_sec,
            "bnsTitle": bns_title[:220],
            "ipc": ipc_sec,
            "ipcTitle": ipc_title[:220],
            "status": ipc_status,
            "chapter": chapter[:140],
        }
    )

print("entries", len(entries))

# Build searchable flat list with normalized keys
mapped = []
for e in entries:
    ipc_base = ""
    bns_base = ""
    if e["ipc"]:
        mb = re.match(r"^(\d+[A-Z]?)", e["ipc"], re.I)
        ipc_base = mb.group(1).upper() if mb else e["ipc"].upper()
    if e["bns"]:
        mb = re.match(r"^(\d+[A-Z]?)", e["bns"], re.I)
        bns_base = mb.group(1).upper() if mb else e["bns"].upper()
    mapped.append(
        {
            **e,
            "ipcBase": ipc_base,
            "bnsBase": bns_base,
            "ipcKey": (e["ipc"] or "").upper(),
            "bnsKey": (e["bns"] or "").upper(),
        }
    )

out = {
    "source": "NCRB Sankalan Portal Corresponding Section Table (BNS 2023 / IPC 1860)",
    "sourceUrl": "https://www.ncrb.gov.in/uploads/SankalanPortal/SectionTableBNS.html",
    "count": len(mapped),
    "entries": mapped,
}

out_path = ROOT / "frontend" / "src" / "data" / "ipcBnsMap.json"
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print("wrote", out_path, "bytes", out_path.stat().st_size)

by_ipc = {}
for e in mapped:
    if e["ipcBase"]:
        by_ipc.setdefault(e["ipcBase"], []).append(e["bns"])

checks = [
    ("302", "103"),
    ("420", "318"),
    ("498A", "85"),
    ("376", "64"),
    ("307", "109"),
    ("379", "303"),
    ("406", "316"),
    ("120B", "61"),
    ("34", "3"),
    ("304A", "106"),
    ("354", "74"),
    ("509", "79"),
]
for ipc, expect in checks:
    hits = by_ipc.get(ipc.upper(), [])
    ok = any(str(expect) == h or (h or "").startswith(str(expect)) for h in hits)
    print(f"IPC {ipc} -> {hits[:6]} expect~{expect} {'OK' if ok else 'CHECK'}")
