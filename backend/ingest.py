import os
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Paths
DATA_PATH = "data/"
DB_PATH = "vector_db/"

def create_vector_db():
    print("🚀 Process Shuru: Naya Data Load kar raha hoon...")
    
    # 1. Purana Database safai (Taaki mix na ho)
    if os.path.exists(DB_PATH):
        shutil.rmtree(DB_PATH)
        print("🧹 Purana database delete kiya (Safai Abhiyan).")

    documents = []
    
    if not os.path.exists(DATA_PATH):
        print(f"❌ ERROR: '{DATA_PATH}' folder nahi mila.")
        return

    # 2. Saare PDFs Load karna
    pdf_files = [f for f in os.listdir(DATA_PATH) if f.endswith(".pdf")]
    
    if not pdf_files:
        print("❌ ERROR: Data folder khali hai! PDFs daalo.")
        return

    print(f"📂 Total {len(pdf_files)} PDFs mile. Padhna shuru kar raha hoon...")

    for file in pdf_files:
        pdf_path = os.path.join(DATA_PATH, file)
        try:
            print(f"   📖 Reading: {file}...")
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())
        except Exception as e:
            print(f"   ⚠️ Error loading {file}: {e}")

    # 3. CHUNKING (Tukde karna)
    print("✂️  Text ke tukde kar raha hoon...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)
    print(f"🧩 Total Tukde (Chunks): {len(chunks)}")

    # 4. EMBEDDINGS & STORAGE (Dimag banana)
    print("💾 Database bana raha hoon (Isme time lag sakta hai)...")
    
    try:
        # Hum 'MiniLM' use kar rahe hain kyunki ye halka aur fast hai normal laptop ke liye
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        
        vector_db = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=DB_PATH
        )
        print("✅ MUBARAK HO! Naya Database 'vector_db' taiyaar hai!")
        print("➡️  Ab tum 'python api.py' chala sakte ho.")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    create_vector_db()