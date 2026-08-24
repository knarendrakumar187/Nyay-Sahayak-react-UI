"""Volume 3 — Backend, deploy, master diagrams, revision pack."""
from __future__ import annotations
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from teacher_lib import TeacherDoc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "teacher", "Nyay_Sahayak_Teacher_Volume_3_Backend_Deploy_Revision.pdf")


def main():
    d = TeacherDoc(OUT, "Volume 3 — Backend, Deploy & Revision Superpack", "VOLUME 3")
    d.cover([
        "FastAPI • ChromaDB RAG • Groq • ingest.py",
        "Every important endpoint • Auth/DB/Deploy flows",
        "100 concepts • 50 Q&A • drills • cheat sheet • glossary",
    ])

    d.h1("Backend kitchen tour")
    d.ascii(
        """
backend/
├── api.py          ← restaurant kitchen (routes + AI)
├── ingest.py       ← chop BNS.pdf into Chroma sticky notes
├── data/BNS.pdf    ← the law book
├── nyay_memory/    ← Chroma persistent DB files
├── requirements.txt
├── Dockerfile
└── .env / .env.example  ← GROQ_API_KEY secret
"""
    )
    d.page_break()

    d.file_chapter(
        path="backend/requirements.txt",
        purpose=["Python packages the API needs (FastAPI, chromadb, groq, etc.)."],
        where_used=["pip install -r requirements.txt on server/local."],
        when_runs=["During environment setup / deploy build."],
        code_lines=["fastapi", "uvicorn", "chromadb", "langchain-groq", "groq", "pypdf", "python-dotenv"],
        line_explanations=[
            ("fastapi", "Web framework for APIs."),
            ("uvicorn", "ASGI server that runs FastAPI."),
            ("chromadb", "Vector database for RAG."),
            ("langchain-groq / groq", "Talk to Groq LLMs + Whisper."),
            ("pypdf", "Read BNS PDF text."),
            ("python-dotenv", "Load .env secrets."),
            ("fpdf / python-docx", "Generate PDF/DOCX documents."),
        ],
        analogy="Kitchen shopping list for Python chefs.",
        if_delete="pip install fails; server cannot start.",
        memory="requirements = Python's package.json.",
        quiz=["Which package serves HTTP?", "Which stores vectors?", "Where is the API key loaded from?"],
        interview=["Pinned versions vs floating versions", "Virtual environments why?"],
    )

    d.file_chapter(
        path="backend/.env.example & backend/.env",
        purpose=["Store GROQ_API_KEY and other secrets outside code."],
        where_used=["load_dotenv() in api.py."],
        when_runs=["Process start."],
        code_lines=["GROQ_API_KEY=your_key_here"],
        line_explanations=[
            (".env.example", "Safe template committed to git."),
            (".env", "Real secrets — should NOT be committed."),
            ("os.getenv", "Read environment variable in Python."),
        ],
        analogy="A locked diary for passwords.",
        if_delete="AI calls fail with missing key warnings.",
        memory=".env = secret envelope.",
        quiz=["Should .env be on GitHub?", "What key does Groq need?"],
        interview=["Twelve-factor app config", "Secret management"],
    )

    d.file_chapter(
        path="backend/ingest.py",
        purpose=["One-time (or repeatable) job: PDF → chunks → Chroma collection bns_law."],
        where_used=["Run manually: python ingest.py from backend/."],
        when_runs=["Before chat RAG works well; after updating BNS.pdf."],
        code_lines=[
            "CHUNK_SIZE = 1400",
            "CHUNK_OVERLAP = 200",
            "chunks = chunk_text(full_text)",
            "collection.add(documents=..., metadatas=..., ids=...)",
        ],
        line_explanations=[
            ("PdfReader", "Extract text page by page."),
            ("chunk_text", "Split long text into overlapping pieces."),
            ("overlap", "Keep context at boundaries so sentences aren't cut cruelly."),
            ("md5 ids", "Stable-ish IDs for chunks."),
            ("metadata page", "Remember which PDF page a chunk came from."),
            ("batch add 32", "Insert in small groups for memory."),
            ("delete_collection", "Rebuild cleanly each full ingest."),
        ],
        analogy="Tearing a huge textbook into flashcards with page numbers, then filing them in a cabinet (Chroma).",
        if_delete="No way to (re)build vector DB from PDF.",
        memory="Ingest = eat the book into memory.",
        quiz=["What is CHUNK_OVERLAP for?", "Collection name?", "Where is PDF path?"],
        interview=["Chunk size tradeoffs", "Why metadata matters for citations"],
    )

    d.file_chapter(
        path="backend/api.py (startup: CORS, Chroma, Groq)",
        purpose=["Create FastAPI app; connect DB; init Groq models; define helpers."],
        where_used=["Uvicorn loads `api:app`."],
        when_runs=["Server process start; handlers run per request."],
        code_lines=[
            "app = FastAPI(...)",
            "app.add_middleware(CORSMiddleware, allow_origins=['*'], ...)",
            "chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)",
            "bns_db = chroma_client.get_collection('bns_law')",
            "draft_llm = ChatGroq(model_name=GROQ_TEXT_MODEL, ...)",
        ],
        line_explanations=[
            ("FastAPI()", "The web app object."),
            ("CORSMiddleware", "Allow browsers from other origins (Vercel) to call API."),
            ("PersistentClient", "Chroma files on disk under nyay_memory/."),
            ("ChatGroq", "LangChain wrapper for Groq chat model."),
            ("Groq() client", "Direct SDK for Whisper audio."),
            ("temperature 0.3", "Somewhat focused answers, little creativity."),
        ],
        analogy="Opening the kitchen: unlock fridge (Chroma), wake the chef (Groq), unlock front door for delivery apps (CORS).",
        if_delete="No API.",
        memory="api.py = heart of backend.",
        quiz=["What does CORS do?", "Which model drafts text?", "Where is Chroma stored?"],
        interview=["CORS risks of allow_origins *", "ASGI vs WSGI"],
    )

    d.file_chapter(
        path="backend/api.py → retrieve_bns_context()",
        purpose=["RAG retrieval: find top matching BNS chunks for a user question."],
        where_used=["generate_live_response before calling LLM."],
        when_runs=["Each streaming chat request."],
        code_lines=[
            "results = bns_db.query(query_texts=[query], n_results=5)",
            "blocks.append(f'[BNS excerpt — page {page}]\\n{doc}')",
            "return '\\n\\n---\\n\\n'.join(blocks)",
        ],
        line_explanations=[
            ("query_texts", "Chroma embeds/searches similar chunks."),
            ("n_results", "How many flashcards to pull."),
            ("documents/metadatas", "Text + page info."),
            ("empty handling", "Return '' if DB missing/empty."),
        ],
        analogy="Librarian fetches 5 most relevant pages before the tutor speaks.",
        if_delete="Chat becomes ungrounded general LLM talk.",
        memory="Retrieve first, generate second = RAG.",
        quiz=["How many chunks by default?", "What if collection empty?"],
        interview=["Dense retrieval vs keyword search", "Hallucination mitigation"],
    )

    d.file_chapter(
        path="backend/api.py → POST /stream-chat",
        purpose=["Main legal Q&A endpoint; streams tokens as plain text."],
        where_used=["App.tsx fetch to `${API}/stream-chat`."],
        when_runs=["When user sends a normal chat message."],
        code_lines=[
            "async def generate_live_response(message, history):",
            "  bns_context = retrieve_bns_context(message)",
            "  full_prompt = system_prompt + context_block + history + message",
            "  async for chunk in draft_llm.astream(full_prompt): yield chunk.content",
            "@app.post('/stream-chat')",
            "return StreamingResponse(..., media_type='text/plain')",
        ],
        line_explanations=[
            ("system_prompt", "Rules: ground in BNS, language match, disclaimer."),
            ("history", "Earlier turns for continuity."),
            ("astream", "Async streaming from Groq."),
            ("yield", "Send piece-by-piece to client."),
            ("StreamingResponse", "FastAPI streaming HTTP body."),
            ("ChatRequest model", "Pydantic validates JSON body."),
        ],
        analogy="Teacher talking live on a phone call instead of mailing one big letter.",
        if_delete="Primary chat feature dies.",
        memory="stream = river of words.",
        quiz=["Media type returned?", "Where do excerpts come from?", "Why include disclaimer?"],
        interview=["SSE vs WebSockets vs chunked HTTP", "Prompt injection basics"],
    )

    d.file_chapter(
        path="backend/api.py → POST /file-report-interview",
        purpose=["FIR interview: ask one question at a time like an SHO."],
        where_used=["App when mode==='report'."],
        when_runs=["Each FIR chat turn."],
        code_lines=[
            "draft_llm.invoke(full_prompt)",
            "return { 'answer': res.content, 'status': 'active' }",
        ],
        line_explanations=[
            ("invoke", "Non-streaming single response."),
            ("ONE question rule", "Keeps conversation structured."),
            ("REPORT_COLLECTED", "Signal when enough details gathered."),
            ("language match", "Reply in user's language."),
        ],
        analogy="A careful police uncle asking step-by-step questions.",
        if_delete="FIR mode backend fails.",
        memory="Interview = questions one by one.",
        quiz=["Streaming or not?", "What special phrase ends collection?"],
        interview=["Conversation state machines", "Safety in legal complaint tools"],
    )

    d.file_chapter(
        path="backend/api.py → POST /voice-message",
        purpose=["Accept audio upload → Whisper transcript → short LLM answer."],
        where_used=["useVoiceAssistant upload."],
        when_runs=["After user records audio."],
        code_lines=[
            "transcription = groq_client.audio.transcriptions.create(model='whisper-large-v3', ...)",
            "user_text = transcription.text",
            "res = draft_llm.invoke(...)",
            "return { 'user_text': user_text, 'answer': ai_response }",
        ],
        line_explanations=[
            ("UploadFile", "FastAPI file upload parameter."),
            ("temp file", "Save briefly, then delete."),
            ("Whisper", "Speech-to-text model."),
            ("language auto-detect", "Works for English/Hindi better when not forced."),
        ],
        analogy="A secretary listens to your voice note, types it, asks the lawyer, replies.",
        if_delete="Voice pipeline breaks.",
        memory="Whisper = ears of the backend.",
        quiz=["Which model transcribes?", "What two fields return?"],
        interview=["Handling PII in audio", "File cleanup importance"],
    )

    d.file_chapter(
        path="backend/api.py → document endpoints",
        purpose=["/generate-legal-notice PDF and /generate-rent-agreement DOCX."],
        where_used=["DocGenModal / useLegalAI."],
        when_runs=["On document generate click."],
        code_lines=[
            "details = json.loads(content)  # from LLM extraction",
            "pdf.output('Legal_Notice.pdf'); return FileResponse(...)",
            "doc.save('Rent_Agreement.docx'); return FileResponse(...)",
        ],
        line_explanations=[
            ("LLM extracts JSON fields", "Names, amount, reason..."),
            ("FPDF", "Build simple PDF."),
            ("python-docx", "Build Word agreement."),
            ("FileResponse", "Send file to browser."),
        ],
        analogy="Fill-in-the-blank printer forms.",
        if_delete="Downloads fail.",
        memory="FileResponse = attach file to reply letter.",
        quiz=["Which library makes PDF?", "Why JSON extraction step?"],
        interview=["Validating LLM JSON safely", "Template documents vs generative docs"],
    )

    d.file_chapter(
        path="backend/Dockerfile (+ Render start)",
        purpose=["Container recipe to run API anywhere Docker runs."],
        where_used=["Docker/Render builds."],
        when_runs=["Image build/deploy."],
        code_lines=["FROM python:...", "COPY requirements.txt", "RUN pip install", "CMD uvicorn api:app ..."],
        line_explanations=[
            ("FROM", "Base image with Python."),
            ("COPY/RUN", "Install deps."),
            ("CMD", "Default start command."),
            ("PORT env", "Cloud sets PORT; uvicorn listens."),
        ],
        analogy="A lunchbox packing instructions so any cafeteria can remake the meal.",
        if_delete="Docker deploys need manual commands.",
        memory="Dockerfile = recipe card.",
        quiz=["What process serves FastAPI?", "Who sets PORT on Render?"],
        interview=["Containers vs VMs", "Health checks"],
    )
    d.page_break()

    # MASTER DIAGRAMS
    d.h1("1) Complete Project Architecture")
    d.ascii(
        """
[User Browser]
    | HTTPS
[React App on Vercel]
    | Firebase Auth/Firestore
[Firebase Cloud]
    | HTTPS JSON/stream
[FastAPI on Render]
    |          \\
[Chroma bns_law] [Groq LLM + Whisper]
    ^
[BNS.pdf via ingest.py]
"""
    )

    d.h1("2) Complete Folder Tree (source focus)")
    d.ascii(
        """
Nyay-Sahayak-react-UI/
├── frontend/src/{main,App,pages,components,hooks,config,data}
├── backend/{api.py,ingest.py,data,nyay_memory}
├── docs/teacher/*.pdf
└── scripts/*.py
"""
    )

    d.h1("3) Request Flow (chat)")
    d.ascii(
        """
Type message → ChatInterface onSend → App fetch /stream-chat
 → retrieve_bns_context → build prompt → Groq astream
 → chunks yield → UI appends text → optional TTS
 → optional Firestore save
"""
    )

    d.h1("4) React Rendering Flow")
    d.ascii(
        """
State/props change → React schedules re-render → Virtual DOM diff
 → update real DOM nodes → browser paints
"""
    )

    d.h1("5) State Flow")
    d.ascii(
        """
App state (source of truth)
  user, theme, mode, messages, flags
    │ props down
    ▼
Children display + call setters via callbacks (events up)
"""
    )

    d.h1("6) API Flow Map")
    d.bullets([
        "POST /stream-chat — RAG legal chat stream",
        "POST /file-report-interview — FIR Q&A",
        "POST /voice-message — audio → text → answer",
        "POST /generate-legal-notice — PDF",
        "POST /generate-rent-agreement — DOCX",
        "Other helpers may exist historically (/ask, analyze-*) via useLegalAI",
    ])

    d.h1("7) Authentication Flow")
    d.ascii(
        """
AuthPage/Google → Firebase Auth
 → onAuthStateChanged in App
 → load role from localStorage/session
 → RoleSelectGate if needed
 → /app allowed
"""
    )

    d.h1("8) Database Flow")
    d.bullets([
        "Firestore: users profiles + chat history documents",
        "ChromaDB: BNS chunks for retrieval (not user accounts)",
        "localStorage: theme, role per uid, sometimes chat cache",
    ])

    d.h1("9–11) Deploy / Build / Data flows")
    d.ascii(
        """
Build frontend: npm run build (tsc + vite) → Vercel CDN
Build backend: pip install → uvicorn → Render web service
Data: BNS.pdf -ingest→ Chroma | NCRB -script→ ipcBnsMap.json
"""
    )

    d.h1("12) Component Relationship (summary)")
    d.p("See Volume 2 diagram; App is the parent hub for /app tools.")
    d.page_break()

    # REVISION PACK
    d.h1("Beginner Revision Superpack")

    d.h2("100 most important concepts (study list)")
    concepts = [
        "HTML page", "DOM", "#root", "SPA", "React component", "JSX", "props", "state", "useState", "useEffect",
        "re-render", "keys", "lists", "events", "controlled input", "form submit", "React Router", "Route", "Navigate",
        "protected route", "layout", "children prop", "lifting state", "callback props", "custom hook", "useMemo",
        "fetch", "JSON", "HTTP POST", "headers", "async/await", "Promise", "streaming response", "blob download",
        "CORS", "environment variable", "Vite", "import.meta.env", "Tailwind class", "dark mode class", "localStorage",
        "sessionStorage", "Firebase Auth", "Google provider", "onAuthStateChanged", "Firestore", "document setDoc",
        "FastAPI", "Pydantic model", "Uvicorn", "endpoint", "StreamingResponse", "UploadFile", "Groq", "LLM",
        "Whisper STT", "TTS speechSynthesis", "RAG", "retrieval", "generation", "embedding search", "ChromaDB",
        "collection", "chunking", "overlap", "metadata", "hallucination", "system prompt", "temperature", "BNS",
        "IPC", "FIR", "NCRB map", "RBAC roles", "normalizeRole", "canAccessMode", "mode state", "Sidebar menu",
        "modal", "boot screen", "Framer Motion", "markdown render", "Vercel", "Render", "Dockerfile", "requirements.txt",
        "package.json", "npm scripts", "build vs start", "API base URL", "error handling", "loading state", "disclaimer",
        "client vs server", "static JSON data", "security basics", "gitignore secrets", "debugging Network tab",
        "console logs", "interview storytelling", "demo script", "technical debt", "feature flags (voice)",
    ]
    # ensure ~100
    while len(concepts) < 100:
        concepts.append(f"Practice concept {len(concepts)+1}: read code aloud")
    for i, c in enumerate(concepts[:100], 1):
        d.p(f"{i}. {c}", "Bullet")

    d.page_break()
    d.h2("50 interview questions with short answers")
    qa = [
        ("What is Nyay Sahayak?", "Full-stack AI legal assistant for India focused on BNS guidance and role-based tools."),
        ("What is RAG?", "Retrieve relevant docs first, then generate an answer grounded in them."),
        ("Why not only an LLM?", "LLMs can invent section numbers; RAG reduces hallucination using BNS text."),
        ("Frontend stack?", "React, Vite, Tailwind, Framer Motion, Firebase, React Router on Vercel."),
        ("Backend stack?", "FastAPI, ChromaDB, Groq, Uvicorn on Render."),
        ("What is ChromaDB here?", "Vector store of BNS PDF chunks collection bns_law."),
        ("How does chat stream?", "POST /stream-chat returns StreamingResponse; UI reads chunks."),
        ("What is roleAccess.js?", "Defines menus and access checks per role."),
        ("Which role gets FIR?", "Police (and Other)."),
        ("Which role gets Quiz?", "Student (and Other)."),
        ("What is Other role?", "Full menu access to all tools."),
        ("How is IPC↔BNS mapped?", "Static NCRB-based JSON lookup, not LLM guessing."),
        ("What does ingest.py do?", "Chunks BNS.pdf into Chroma."),
        ("What is ProtectedRoute?", "Redirects unauthenticated users to /login."),
        ("How is theme stored?", "localStorage theme + html dark/light class."),
        ("What is Firebase used for?", "Auth + Firestore chat/user data."),
        ("What is useLegalAI?", "Custom hook wrapping several backend API calls."),
        ("What is CORS?", "Browser security rules for cross-origin API calls."),
        ("Why VITE_API_URL?", "Configure backend URL per environment."),
        ("What model drafts answers?", "Groq text model via ChatGroq (e.g. openai/gpt-oss-120b as configured)."),
        ("What model transcribes audio?", "whisper-large-v3 via Groq."),
        ("What is a prop?", "Data passed from parent component to child."),
        ("What is state?", "Component memory that triggers re-render when updated."),
        ("What is re-rendering?", "React calling the component function again to refresh UI."),
        ("What is JSX?", "Syntax that looks like HTML inside JavaScript."),
        ("What is an SPA?", "Single Page Application — client router changes views."),
        ("What does npm run build do?", "Typecheck + Vite bundles production assets."),
        ("What is StreamingResponse?", "FastAPI way to send response body gradually."),
        ("What is Pydantic for?", "Validate request body shapes."),
        ("What is temperature?", "Controls randomness of LLM output."),
        ("What is hallucination?", "Model inventing false facts."),
        ("How do you demo the app?", "Login → role tools → mapper → quiz → streaming chat."),
        ("Where is frontend hosted?", "Vercel."),
        ("Where is backend hosted?", "Render."),
        ("What is vercel.json rewrite for?", "Support client routes on refresh."),
        ("What is .env?", "Local secret/config file."),
        ("Should API keys be in frontend?", "Never put private server keys in frontend."),
        ("What is Framer Motion?", "Animation library."),
        ("What is lucide-react?", "Icon pack."),
        ("What is react-markdown?", "Renders markdown strings as React elements."),
        ("What is getUserMedia?", "Browser API to access microphone/camera."),
        ("What is MediaRecorder?", "Records media streams to blobs."),
        ("What is speechSynthesis?", "Browser text-to-speech API."),
        ("What is normalizeRole?", "Maps aliases like 'law student' to Student."),
        ("What happens if role lacks mode?", "App resets to defaultModeForRole."),
        ("What is FIR?", "First Information Report."),
        ("What is BNS?", "Bharatiya Nyaya Sanhita — new criminal code."),
        ("What is IPC?", "Older Indian Penal Code sections."),
        ("Limitation to admit?", "Not a substitute for a licensed advocate."),
        ("Next improvement idea?", "Show citations of retrieved chunks; Hindi UX; eval harness."),
    ]
    for i, (q, a) in enumerate(qa, 1):
        d.p(f"<b>Q{i}. {q}</b>", "Label")
        d.p(f"A. {a}", "Kid")

    d.page_break()
    d.h2("30 debugging exercises")
    for i, ex in enumerate([
        "Blank page: check #root and main.tsx console errors.",
        "Theme flash: verify index.html theme script.",
        "Login loops: inspect onAuthStateChanged and ProtectedRoute.",
        "Role menu empty: log normalizeRole(user.role).",
        "Quiz missing: confirm role Student/Other and mode quiz route branch.",
        "Chat no reply: Network tab /stream-chat status.",
        "CORS error: backend CORSMiddleware origins.",
        "API 500: Render logs + GROQ_API_KEY.",
        "Empty RAG: run ingest.py; check bns_db.count().",
        "Stream stuck: reader loop / content-type.",
        "Mapper no hits: inspect ipcBnsMap.json import.",
        "Voice denied: browser permission + https requirements.",
        "Firestore permission error: rules/auth user.",
        "Vercel 404 on refresh: vercel.json rewrites.",
        "Env ignored: ensure VITE_ prefix and rebuild.",
        "Wrong tool after role change: canAccessMode effect.",
        "Mobile sidebar stuck: overlay onClose handlers.",
        "Markdown ugly: react-markdown import/usage.",
        "Double messages: StrictMode + effect deps.",
        "Slow chat: model latency; show loading UI.",
        "FIR language mismatch: prompt language rules.",
        "Doc download fails: blob handling + FileResponse.",
        "Chroma path wrong: CHROMA_PATH on server disk.",
        "Docker build fail: requirements pins.",
        "Tailwind class missing: content paths in config.",
        "Icon undefined: ICONS map name typo.",
        "Google popup blocked: browser settings.",
        "localStorage role lost: uid key mismatch.",
        "TypeScript build fail: tsc -b errors.",
        "Production points localhost: VITE_API_URL on Vercel.",
    ], 1):
        d.p(f"{i}. {ex}", "Bullet")

    d.h2("20 coding exercises")
    for i, ex in enumerate([
        "Add a new role 'Journalist' with chat+mapper only.",
        "Add a 9th quiz question to BANK.",
        "Show retrieved page numbers in the chat UI.",
        "Add a Hindi toggle that forces language in API body.",
        "Disable FIR for Other role and explain tradeoff.",
        "Add loading skeleton to IpcBnsMapper.",
        "Write a unit test for normalizeRole.",
        "Add rate-limit warning message in UI.",
        "Cache last 3 searches in mapper localStorage.",
        "Add 'Copy answer' button on AI bubbles.",
        "Create a /health endpoint on FastAPI.",
        "Log retrieval chunk count server-side.",
        "Replace allow_origins * with your Vercel domain.",
        "Add empty-state illustration when messages=[].",
        "Make Settings theme sync HomePage without reload.",
        "Add keyboard shortcut Ctrl+K to focus composer.",
        "Paginate GovServices cards.",
        "Add disclaimer footer component shared everywhere.",
        "Build a simple Jest/Vitest test for shuffle().",
        "Document your change in README in 5 lines.",
    ], 1):
        d.p(f"{i}. {ex}", "Bullet")

    d.page_break()
    d.h2("Common beginner mistakes")
    d.bullets([
        "Editing code but not saving / not refreshing.",
        "Confusing frontend port (5173) with backend (8000).",
        "Forgetting to run ingest.py then blaming the LLM.",
        "Putting GROQ key in frontend code.",
        "Expecting JSX inside roleAccess.js after the createElement fix lesson.",
        "Mutating state directly (messages.push) instead of setMessages.",
        "Missing dependency arrays causing infinite useEffect loops.",
        "Assuming mapper uses AI — it does not.",
        "Deploying frontend without setting VITE_API_URL.",
        "Thinking README runs as code.",
    ])

    d.h2("Cheat sheet")
    d.ascii(
        """
Start FE:  cd frontend && npm install && npm run dev
Start BE:  cd backend && pip install -r requirements.txt && uvicorn api:app --reload
Ingest:    cd backend && python ingest.py
Chat API:  POST /stream-chat {message, history}
Roles:     Citizen Advocate Police Student Other
Modes:     chat report quiz ipc-bns digital
Theme:     localStorage 'theme' + html.dark
Auth:      Firebase Auth
RAG:       Chroma bns_law → Groq stream
Host:      Vercel + Render
"""
    )

    d.h2("Glossary")
    glossary = [
        ("Component", "Reusable UI function/brick."),
        ("Props", "Inputs from parent."),
        ("State", "Internal memory."),
        ("Hook", "Special function like useState."),
        ("API", "Door for programs to talk."),
        ("Endpoint", "One specific API door path."),
        ("JSON", "Common data text format."),
        ("SPA", "App that changes views without full reload."),
        ("Bundle", "Packed JS/CSS files for production."),
        ("Vector DB", "Database that finds 'similar meaning' text."),
        ("Token", "Small piece of AI text output."),
        ("Streaming", "Sending output gradually."),
        ("Auth", "Proving who you are."),
        ("Firestore", "Firebase cloud database."),
        ("CORS", "Browser cross-site request rules."),
        ("Env var", "Config value outside code."),
        ("Deploy", "Put app on the internet."),
        ("RAG", "Retrieve then generate."),
        ("LLM", "Large language model AI."),
        ("FIR", "Police first report."),
    ]
    for k, v in glossary:
        d.p(f"<b>{k}:</b> {v}", "Bullet")

    d.h2("Final teacher message")
    d.p(
        "If you can explain Volume 1 flow, Volume 2 component gifts (props), and Volume 3 RAG kitchen, "
        "you can survive interviews and change this code with courage. Read one file per day. "
        "Do every Mini Quiz out loud. Then teach a friend. Teaching is the final boss — and you will win."
    )
    print("WROTE", d.build())


if __name__ == "__main__":
    main()
