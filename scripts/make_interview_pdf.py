"""Generate Nyay Sahayak project guide + interview prep PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
import os

OUT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "Nyay_Sahayak_Project_Guide_Interview_Prep.pdf",
)

TEAL = HexColor("#0A6B63")
INK = HexColor("#07131C")
MUTE = HexColor("#3D5163")
LIGHT = HexColor("#F4F7F9")
CARD = HexColor("#E8F4F1")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=26,
        textColor=TEAL,
        alignment=TA_CENTER,
        spaceAfter=8,
        leading=32,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSub",
        fontName="Helvetica",
        fontSize=12,
        textColor=MUTE,
        alignment=TA_CENTER,
        spaceAfter=6,
        leading=16,
    )
)
styles.add(
    ParagraphStyle(
        name="H1Custom",
        fontName="Helvetica-Bold",
        fontSize=16,
        textColor=TEAL,
        spaceBefore=16,
        spaceAfter=8,
        leading=20,
    )
)
styles.add(
    ParagraphStyle(
        name="H2Custom",
        fontName="Helvetica-Bold",
        fontSize=13,
        textColor=INK,
        spaceBefore=12,
        spaceAfter=6,
        leading=17,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyCustom",
        fontName="Helvetica",
        fontSize=10.5,
        textColor=INK,
        alignment=TA_JUSTIFY,
        spaceAfter=7,
        leading=15,
    )
)
styles.add(
    ParagraphStyle(
        name="Kid",
        fontName="Helvetica",
        fontSize=11,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=8,
        leading=16,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletCustom",
        fontName="Helvetica",
        fontSize=10.5,
        textColor=INK,
        leftIndent=12,
        spaceAfter=4,
        leading=14,
    )
)
styles.add(
    ParagraphStyle(
        name="Cell",
        fontName="Helvetica",
        fontSize=9.5,
        textColor=INK,
        leading=13,
    )
)
styles.add(
    ParagraphStyle(
        name="CellHead",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        textColor=white,
        leading=13,
    )
)
styles.add(
    ParagraphStyle(
        name="Q",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        textColor=TEAL,
        spaceBefore=8,
        spaceAfter=3,
        leading=14,
    )
)
styles.add(
    ParagraphStyle(
        name="A",
        fontName="Helvetica",
        fontSize=10.5,
        textColor=INK,
        leftIndent=6,
        spaceAfter=6,
        leading=14,
    )
)
styles.add(
    ParagraphStyle(
        name="PromptBox",
        fontName="Helvetica",
        fontSize=9.5,
        textColor=INK,
        leading=13,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        fontName="Helvetica",
        fontSize=9,
        textColor=MUTE,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="FooterNote",
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        textColor=MUTE,
        alignment=TA_CENTER,
    )
)
styles.add(
    ParagraphStyle(
        name="Tip",
        fontName="Helvetica-Oblique",
        fontSize=10,
        textColor=MUTE,
        leftIndent=8,
        spaceAfter=6,
        leading=13,
    )
)

story = []

# COVER
story.append(Spacer(1, 1.6 * inch))
story.append(Paragraph("Nyay Sahayak", styles["CoverTitle"]))
story.append(Paragraph("AI Legal Assistant for India", styles["CoverSub"]))
story.append(Spacer(1, 0.25 * inch))
story.append(
    HRFlowable(width="60%", thickness=2, color=TEAL, spaceBefore=4, spaceAfter=12, hAlign="CENTER")
)
story.append(Paragraph("Project Understanding Guide + Interview Prep", styles["CoverSub"]))
story.append(
    Paragraph(
        "Explained simply (even if you are new) + answers that impress interviewers",
        styles["CoverSub"],
    )
)
story.append(Spacer(1, 0.5 * inch))
story.append(Paragraph("Live app: nyay-sahayak-react-ui.vercel.app", styles["Small"]))
story.append(
    Paragraph(
        "GitHub: github.com/knarendrakumar187/Nyay-Sahayak-react-UI",
        styles["Small"],
    )
)
story.append(Paragraph("API docs: nyay-sahayak-api-i0so.onrender.com/docs", styles["Small"]))
story.append(Spacer(1, 1.0 * inch))
story.append(
    Paragraph(
        "Includes: Kid-simple explanation · Architecture · Roles · Tech stack · "
        "RAG basics · Interview Q&amp;A · Reusable learning prompt · Demo script",
        styles["FooterNote"],
    )
)
story.append(PageBreak())

# TOC
story.append(Paragraph("What is inside this PDF", styles["H1Custom"]))
for t in [
    "1. Explain like I am 11 years old",
    "2. Important Indian law words (mini dictionary)",
    "3. What the app can do (features)",
    "4. Who uses what (roles)",
    "5. How the magic works (RAG — simple + interview level)",
    "6. Tech stack map",
    "7. Request flow (what happens when you ask a question)",
    "8. Project folders (where code lives)",
    "9. Interview Q&amp;A (strong answers)",
    "10. One-minute elevator pitch",
    "11. Resume bullets you can copy",
    "12. Reusable prompt (ask any AI / revise yourself)",
    "13. Extra tips + demo script + self-test",
]:
    story.append(Paragraph(t, styles["BulletCustom"]))
story.append(PageBreak())

# 1
story.append(Paragraph("1. Explain like I am 11 years old", styles["H1Custom"]))
story.append(
    Paragraph(
        "<b>Nyay Sahayak</b> means \"Justice Helper\". Imagine India has a huge law book. "
        "The old book was called <b>IPC</b>. The new book is called <b>BNS</b> "
        "(Bharatiya Nyaya Sanhita). Reading all of it is hard — even grown-ups get confused!",
        styles["Kid"],
    )
)
story.append(
    Paragraph(
        "This app is like a <b>smart helper friend</b> on your phone or computer. You ask: "
        "\"What happens if someone steals my phone?\" The helper does NOT invent random answers. "
        "First it looks inside the real law book pages that match your question. "
        "Then it explains in simple English.",
        styles["Kid"],
    )
)
story.append(
    Paragraph(
        "Think of a library: you ask the librarian a question. The librarian finds the right pages, "
        "reads them, and then explains them to you. That \"find the right pages\" part is called "
        "<b>RAG</b>. The \"explain\" part is done by an AI brain (we use <b>Groq</b>).",
        styles["Kid"],
    )
)
story.append(
    Paragraph(
        "Different people need different tools: a police officer may want help writing a report "
        "(FIR). A student may want a quiz. A citizen may want government website links. "
        "So the menu changes by <b>role</b> — like different backpacks for different school trips.",
        styles["Kid"],
    )
)
story.append(
    Paragraph(
        "<b>Safety note for interviews:</b> This is an assistant for learning and guidance — "
        "not a replacement for a real lawyer in court.",
        styles["Tip"],
    )
)

# 2
story.append(Paragraph("2. Mini dictionary (basics)", styles["H1Custom"]))
dict_rows = [
    ("BNS", "New Indian criminal law book (replaced many IPC parts)"),
    ("IPC", "Older criminal law sections people still remember"),
    ("FIR", "First Information Report — police complaint start"),
    ("RAG", "AI first searches your documents, then answers"),
    ("LLM", "Large Language Model — the AI that writes answers"),
    ("ChromaDB", "Database that stores law text pieces for search"),
    ("Firebase", "Login + save chat history in the cloud"),
    ("FastAPI", "Python backend that serves the AI APIs"),
    ("React", "Frontend library that builds the screens"),
    ("Vercel / Render", "Where frontend / backend are hosted online"),
    ("Streaming", "Answer appears word-by-word instead of waiting forever"),
    ("Hallucination", "When AI invents fake facts — RAG reduces this risk"),
]
dict_data = [
    [
        Paragraph("<b>Word</b>", styles["CellHead"]),
        Paragraph("<b>Simple meaning</b>", styles["CellHead"]),
    ]
]
for w, m in dict_rows:
    dict_data.append([Paragraph(w, styles["Cell"]), Paragraph(m, styles["Cell"])])
t = Table(dict_data, colWidths=[1.5 * inch, 4.9 * inch])
t.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), TEAL),
            ("BACKGROUND", (0, 1), (-1, -1), LIGHT),
            ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#CBD5E1")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]
    )
)
story.append(t)
story.append(PageBreak())

# 3
story.append(Paragraph("3. What the app can do", styles["H1Custom"]))
for f in [
    "<b>Legal Chat (RAG):</b> Ask law questions; answers use BNS text from a vector database + Groq LLM.",
    "<b>Role-based menus:</b> Citizen, Advocate, Police, Law Student, Other (Other = all tools).",
    "<b>FIR helper:</b> Interactive report flow (mainly Police; Other also has it).",
    "<b>IPC ↔ BNS Mapping:</b> Look up old IPC section → new BNS section (NCRB-based table ~550 rows).",
    "<b>BNS Practice Quiz:</b> MCQ practice for Law Students (and Other).",
    "<b>E-Legal Seva:</b> Links to useful government portals (e-Courts, RTI, DigiLocker, cybercrime, etc.).",
    "<b>Voice:</b> Speak questions / hear answers (English).",
    "<b>Auth:</b> Email/password + Google login (Firebase); chats saved in Firestore.",
    "<b>Theme:</b> Dark by default; light/dark in settings.",
]:
    story.append(Paragraph("• " + f, styles["BulletCustom"]))

# 4
story.append(Paragraph("4. Roles → tools", styles["H1Custom"]))
role_rows = [
    ("Citizen", "Ask Legal Help, IPC↔BNS map, Citizen Seva"),
    ("Advocate", "Legal Research, map, Court &amp; Seva links"),
    ("Police", "Legal Assistant, <b>FIR</b>, map, Official Portals"),
    ("Student", "Learn BNS, <b>Quiz</b>, map, Explore Services"),
    ("Other", "Everything: chat, FIR, quiz, map, services"),
]
role_data = [
    [
        Paragraph("<b>Role</b>", styles["CellHead"]),
        Paragraph("<b>Main tools</b>", styles["CellHead"]),
    ]
]
for r, tools in role_rows:
    role_data.append([Paragraph(r, styles["Cell"]), Paragraph(tools, styles["Cell"])])
rt = Table(role_data, colWidths=[1.3 * inch, 5.1 * inch])
rt.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), TEAL),
            ("BACKGROUND", (0, 1), (-1, -1), CARD),
            ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#CBD5E1")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]
    )
)
story.append(rt)

# 5
story.append(Paragraph("5. How the magic works (RAG)", styles["H1Custom"]))
story.append(Paragraph("<b>Kid version</b>", styles["H2Custom"]))
story.append(
    Paragraph(
        "1) We cut the big BNS PDF into small pieces (chunks).<br/>"
        "2) We store those pieces in ChromaDB like labeled sticky notes.<br/>"
        "3) When you ask a question, we find the sticky notes that look most related.<br/>"
        "4) We give those notes + your question to Groq.<br/>"
        "5) Groq writes a clear answer using those notes (streaming, word by word on screen).",
        styles["Kid"],
    )
)
story.append(Paragraph("<b>Interview version</b>", styles["H2Custom"]))
story.append(
    Paragraph(
        "RAG = Retrieval-Augmented Generation. Instead of relying only on the LLM's training "
        "memory (which can hallucinate statutes), we retrieve relevant chunks from an authoritative "
        "corpus (BNS.pdf ingested into ChromaDB collection <b>bns_law</b>), then condition the LLM "
        "prompt on that context. This improves grounding, auditability, and domain correctness for "
        "legal Q&amp;A.",
        styles["BodyCustom"],
    )
)

# 6
story.append(Paragraph("6. Tech stack map", styles["H1Custom"]))
story.append(
    Paragraph(
        "<b>Frontend:</b> React 19 + Vite, Tailwind CSS, Framer Motion, React Router, "
        "Firebase Auth &amp; Firestore → hosted on <b>Vercel</b>.",
        styles["BulletCustom"],
    )
)
story.append(
    Paragraph(
        "<b>Backend:</b> FastAPI + Uvicorn, Groq / LangChain-Groq, ChromaDB, pypdf / docx helpers "
        "→ hosted on <b>Render</b>.",
        styles["BulletCustom"],
    )
)
story.append(
    Paragraph(
        "<b>Data:</b> BNS.pdf → Chroma; ipcBnsMap.json (NCRB mapping); Firebase for users &amp; chat history.",
        styles["BulletCustom"],
    )
)
story.append(PageBreak())

# 7
story.append(Paragraph("7. What happens when you ask a question", styles["H1Custom"]))
for i, s in enumerate(
    [
        "You type/speak a question in the React app (after login + choosing role).",
        "Frontend sends HTTPS request to FastAPI backend.",
        "Backend searches ChromaDB for relevant BNS chunks.",
        "Backend builds a prompt: system rules + retrieved context + user question.",
        "Groq LLM streams the answer back.",
        "UI shows the answer live; optional voice TTS can speak it.",
        "Chat may be saved to Firestore for that user.",
    ],
    1,
):
    story.append(Paragraph(f"<b>{i}.</b> {s}", styles["BulletCustom"]))

# 8
story.append(Paragraph("8. Project folders (mental map)", styles["H1Custom"]))
for line in [
    "• <b>frontend/</b> — UI: pages (Home, Auth), components (Chat, Sidebar, Quiz, Mapper), Firebase, roleAccess.js",
    "• <b>backend/</b> — api.py (routes), ingest.py (PDF → Chroma), data/BNS.pdf, requirements, Dockerfile",
    "• <b>frontend/src/config/roleAccess.js</b> — which menu each role sees",
    "• <b>frontend/src/data/ipcBnsMap.json</b> — IPC↔BNS lookup table",
]:
    story.append(Paragraph(line, styles["BulletCustom"]))

# 9
story.append(Paragraph("9. Interview Q&amp;A (practice these aloud)", styles["H1Custom"]))
qa = [
    (
        "Q1. What problem does Nyay Sahayak solve?",
        "Many Indians find criminal law hard after IPC→BNS changes. Lawyers are costly for first "
        "guidance. We give role-based, BNS-grounded assistance, mapping, FIR help, and government "
        "service links in English.",
    ),
    (
        "Q2. Why RAG instead of only ChatGPT-style prompting?",
        "Legal answers need grounding in statute text. Pure LLMs may hallucinate section numbers. "
        "RAG retrieves BNS chunks first, then generates — better accuracy and explainability.",
    ),
    (
        "Q3. Why ChromaDB + Groq?",
        "ChromaDB is a practical vector store for embedding search over our ingested BNS corpus. "
        "Groq gives fast LLM inference, which helps streaming UX.",
    ),
    (
        "Q4. How do roles work?",
        "Menus are configured in roleAccess.js. canAccessMode() blocks unauthorized tools "
        "(e.g., FIR is Police/Other). Role is chosen at signup / first open and can change in settings.",
    ),
    (
        "Q5. How is IPC↔BNS mapping done?",
        "Not guessed by the LLM. We use a structured NCRB-based JSON table (~550 rows) with "
        "bidirectional lookup UI.",
    ),
    (
        "Q6. How do you handle auth and history?",
        "Firebase Authentication (email + Google). Chat history stored in Firestore keyed by user. "
        "Frontend hosted on Vercel; API on Render.",
    ),
    (
        "Q7. Biggest challenges you faced?",
        "Keeping answers grounded; role gating correctly; dark-theme UX polish; deploying FastAPI + "
        "Chroma persistence on Render; fixing build issues (e.g., JSX in .js config); "
        "CORS/env between Vercel and Render.",
    ),
    (
        "Q8. Limitations / honesty?",
        "Not a licensed lawyer substitute. Demo voice depends on browser APIs. Vector quality "
        "depends on chunking/ingest. Mapping table coverage depends on NCRB data completeness.",
    ),
    (
        "Q9. How would you improve it next?",
        "Better citations (show exact BNS chunk), multilingual (Hindi), evaluation set for RAG "
        "quality, rate limiting, admin ingest pipeline, stronger FIR validation, tests/CI.",
    ),
    (
        "Q10. Explain the architecture in 30 seconds.",
        "React client on Vercel talks to FastAPI on Render. FastAPI retrieves BNS context from "
        "ChromaDB and streams Groq answers. Firebase handles login and chat storage. Extra tools: "
        "mapper, quiz, seva links, FIR flow by role.",
    ),
]
for q, a in qa:
    story.append(Paragraph(q, styles["Q"]))
    story.append(Paragraph(a, styles["A"]))

story.append(PageBreak())

# 10
story.append(Paragraph("10. One-minute elevator pitch (memorize)", styles["H1Custom"]))
story.append(
    Paragraph(
        "\"Nyay Sahayak is a full-stack AI legal assistant for India. Users pick a role — citizen, "
        "advocate, police, student, or other — and get the right tools. Core chat uses RAG over "
        "Bharatiya Nyaya Sanhita with ChromaDB and Groq, so answers are grounded in statute text. "
        "We also ship IPC↔BNS mapping from NCRB data, a student quiz, FIR guidance, and government "
        "portal links. Frontend is React on Vercel; backend is FastAPI on Render; auth and history "
        "use Firebase.\"",
        styles["BodyCustom"],
    )
)

# 11
story.append(Paragraph("11. Resume bullets (copy-ready)", styles["H1Custom"]))
for r in [
    "Built a full-stack AI legal assistant grounded in BNS using RAG (ChromaDB + Groq) with streaming chat.",
    "Implemented role-based access (Citizen/Advocate/Police/Student/Other) with FIR, quiz, and Seva tools.",
    "Delivered IPC↔BNS bidirectional mapping from official NCRB correspondence data (~550 sections).",
    "Integrated Firebase Auth (email + Google) and Firestore chat history; deployed on Vercel + Render.",
    "Added voice Q&amp;A, dark/light theme, and production UI polish for mobile and desktop.",
]:
    story.append(Paragraph("• " + r, styles["BulletCustom"]))

# 12 PROMPT
story.append(Paragraph("12. Reusable prompt (paste into ChatGPT/Cursor to study)", styles["H1Custom"]))
story.append(
    Paragraph(
        "Copy everything inside the box below whenever you want an AI to teach you this project again:",
        styles["BodyCustom"],
    )
)
prompt_text = (
    "You are my patient tutor. I built (or am studying) Nyay Sahayak — an AI legal assistant for India.<br/><br/>"
    "Stack: React+Vite+Tailwind frontend (Vercel), FastAPI+Groq+ChromaDB backend (Render), "
    "Firebase Auth/Firestore.<br/>"
    "Features: BNS RAG chat, role-based menus (Citizen/Advocate/Police/Student/Other), FIR flow, "
    "IPC↔BNS map (NCRB JSON), student quiz, e-Seva links, voice, dark theme.<br/><br/>"
    "Teach me from zero like I am new (even 11-year-old simple analogies), then raise to interview level.<br/>"
    "Always cover: problem statement, architecture diagram in words, RAG pipeline steps, why not plain LLM, "
    "role gating, data sources, deployment, limitations, and 5 likely interview questions with strong answers.<br/>"
    "Ask me 3 check questions at the end to test if I understood.<br/>"
    "Repo: https://github.com/knarendrakumar187/Nyay-Sahayak-react-UI<br/>"
    "Live: https://nyay-sahayak-react-ui.vercel.app"
)
pb = Table([[Paragraph(prompt_text, styles["PromptBox"])]], colWidths=[6.4 * inch])
pb.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, -1), HexColor("#F0FDFA")),
            ("BOX", (0, 0), (-1, -1), 1.2, TEAL),
            ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ("TOPPADDING", (0, 0), (-1, -1), 10),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ]
    )
)
story.append(pb)
story.append(PageBreak())

# 13 EXTRA
story.append(Paragraph("13. Extra tips to perform well in interviews", styles["H1Custom"]))
for tip in [
    "<b>Start with the problem, not the tech.</b> Interviewers love \"why this exists\".",
    "<b>Draw the flow:</b> UI → API → Chroma retrieve → Groq generate → stream → Firestore.",
    "<b>Say \"grounding\" and \"hallucination\"</b> when talking about RAG — shows ML awareness.",
    "<b>Be honest about limits</b> (not a lawyer; mapping table coverage; chunk quality).",
    "<b>Own one deep dive:</b> e.g., roleAccess.js gating OR ingest.py chunking OR mapper JSON.",
    "<b>Mention production:</b> Vercel + Render + Firebase = you shipped, not only localhost.",
    "<b>Security talking points:</b> auth for app routes, no API keys in frontend, role checks on modes.",
    "<b>If stuck:</b> \"I would check network tab, API /docs, and Chroma retrieval logs\".",
    "<b>Future work:</b> citations, Hindi, eval harness, rate limits — shows growth mindset.",
]:
    story.append(Paragraph("• " + tip, styles["BulletCustom"]))

story.append(Paragraph("Bonus: 90-second live demo script", styles["H2Custom"]))
for step in [
    "1. Open live site → show landing (dark theme brand).",
    "2. Login → choose <b>Student</b> → open BNS Practice Quiz → answer 1–2 questions.",
    "3. Settings → switch role to <b>Other</b> → show full menu (FIR + Quiz).",
    "4. Open IPC↔BNS Mapping → search IPC 420 → show BNS mapping.",
    "5. Ask chat: \"What changed from IPC to BNS for theft?\" → point to streaming answer.",
    "6. End with: \"Grounded in BNS via RAG; roles personalize tools; deployed on Vercel + Render.\"",
]:
    story.append(Paragraph(step, styles["BulletCustom"]))

story.append(Paragraph("Quick self-test (answer without looking)", styles["H2Custom"]))
for i, tq in enumerate(
    [
        "What does RAG stand for and why do we use it here?",
        "Name 5 roles and one tool special for Police / Student.",
        "Where is frontend hosted? Where is backend hosted?",
        "What file controls role menus?",
        "What is the source of IPC↔BNS mapping data?",
    ],
    1,
):
    story.append(Paragraph(f"{i}. {tq}", styles["BulletCustom"]))

story.append(Spacer(1, 0.4 * inch))
story.append(HRFlowable(width="100%", thickness=1, color=TEAL, spaceBefore=6, spaceAfter=10))
story.append(
    Paragraph(
        "You got this. Understand the story → explain the flow → admit limits → show next steps.",
        styles["CoverSub"],
    )
)
story.append(Paragraph("Nyay Sahayak — Project Guide &amp; Interview Prep", styles["FooterNote"]))


def add_page_number(canvas, doc):
    canvas.saveState()
    page = canvas.getPageNumber()
    if page > 1:
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(MUTE)
        canvas.drawCentredString(A4[0] / 2, 1.2 * cm, f"Nyay Sahayak Guide  ·  page {page}")
        canvas.setStrokeColor(TEAL)
        canvas.setLineWidth(0.6)
        canvas.line(1.5 * cm, A4[1] - 1.2 * cm, A4[0] - 1.5 * cm, A4[1] - 1.2 * cm)
    canvas.restoreState()


doc = SimpleDocTemplate(
    OUT,
    pagesize=A4,
    leftMargin=1.6 * cm,
    rightMargin=1.6 * cm,
    topMargin=1.6 * cm,
    bottomMargin=1.8 * cm,
    title="Nyay Sahayak — Project Guide & Interview Prep",
    author="Nyay Sahayak",
)
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print("CREATED", OUT)
print("SIZE_KB", round(os.path.getsize(OUT) / 1024, 1))
