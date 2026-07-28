"""
Ingest Bharatiya Nyaya Sanhita (BNS) PDF into ChromaDB for RAG.

Usage (from backend/):
  python ingest.py
"""

from __future__ import annotations

import hashlib
import re
import sys
from pathlib import Path

import chromadb
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
PDF_PATH = BASE_DIR / "data" / "BNS.pdf"
DB_PATH = BASE_DIR / "nyay_memory"
COLLECTION_NAME = "bns_law"

# Larger chunks = fewer embeddings (faster ingest, fits Render free build)
CHUNK_SIZE = 1400
CHUNK_OVERLAP = 200


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if not text:
        return []
    if len(text) <= chunk_size:
        return [text]

    chunks: list[str] = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + chunk_size, length)
        if end < length:
            window = text[start:end]
            break_at = max(window.rfind("\n\n"), window.rfind(". "), window.rfind("। "))
            if break_at > chunk_size // 2:
                end = start + break_at + 1
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        # Always advance enough to avoid tiny/near-duplicate slices
        next_start = end - overlap
        if next_start <= start:
            next_start = end
        start = next_start
        if start >= length:
            break
    return chunks


def load_pdf_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    parts: list[str] = []
    for i, page in enumerate(reader.pages, start=1):
        raw = page.extract_text() or ""
        cleaned = raw.strip()
        if cleaned:
            parts.append(f"[Page {i}]\n{cleaned}")
    return "\n\n".join(parts)


def main() -> int:
    if not PDF_PATH.exists():
        print(f"ERROR: PDF not found at {PDF_PATH}")
        print("Place BNS.pdf in backend/data/BNS.pdf and retry.")
        return 1

    print(f"Reading {PDF_PATH} ...")
    full_text = load_pdf_text(PDF_PATH)
    if not full_text.strip():
        print("ERROR: No extractable text found in PDF.")
        return 1

    chunks = chunk_text(full_text)
    print(f"Prepared {len(chunks)} chunks ({len(full_text):,} characters).")

    documents: list[str] = []
    metadatas: list[dict] = []
    ids: list[str] = []

    for idx, chunk in enumerate(chunks):
        page_match = re.search(r"\[Page (\d+)\]", chunk)
        page_num = int(page_match.group(1)) if page_match else 0
        doc_id = hashlib.md5(f"{idx}:{chunk[:120]}".encode()).hexdigest()
        documents.append(chunk)
        metadatas.append(
            {
                "source": "BNS.pdf",
                "law": "Bharatiya Nyaya Sanhita",
                "page": page_num,
                "chunk": idx,
            }
        )
        ids.append(doc_id)

    print(f"Writing ChromaDB collection '{COLLECTION_NAME}' -> {DB_PATH}")
    DB_PATH.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(DB_PATH))

    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Bharatiya Nyaya Sanhita (BNS) official text"},
    )

    batch_size = 32
    for i in range(0, len(documents), batch_size):
        end = i + batch_size
        collection.add(
            documents=documents[i:end],
            metadatas=metadatas[i:end],
            ids=ids[i:end],
        )
        print(f"  Indexed {min(end, len(documents))}/{len(documents)}")

    print(f"Done. Collection count: {collection.count()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
