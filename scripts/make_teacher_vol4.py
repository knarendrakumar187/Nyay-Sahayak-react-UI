"""Volume 4 — Line-by-line deep dive: ChatInterface.jsx + api.py"""
from __future__ import annotations
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
from teacher_lib import TeacherDoc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(
    ROOT, "docs", "teacher", "Nyay_Sahayak_Teacher_Volume_4_DeepDive_Chat_and_API.pdf"
)


def block(d, title, lines, explanations, analogy, if_delete, memory, quiz, interview, purpose=None):
    d.file_banner(title)
    if purpose:
        d.h3("Purpose")
        d.p(purpose, "Kid")
    d.h3("Code")
    d.code_block(lines)
    d.h3("Explain EVERY LINE / idea")
    for line, expl in explanations:
        d.p(f"<b>{line}</b>", "Label")
        d.p(expl, "Kid")
    d.h3("Real-life analogy")
    d.p(analogy, "Analogy")
    d.h3("What if we delete / change this?")
    d.p(if_delete, "Warn")
    d.h3("Memory Trick")
    d.p(memory, "Kid")
    d.h3("Mini Quiz")
    for i, q in enumerate(quiz, 1):
        d.p(f"{i}. {q}", "BulletT")
    d.h3("Interview angle")
    for i, q in enumerate(interview, 1):
        d.p(f"{i}. {q}", "BulletT")
    d.story.append(__import__("reportlab.platypus", fromlist=["HRFlowable"]).platypus.HRFlowable(
        width="100%", thickness=0.5, color=__import__("reportlab.lib.colors", fromlist=["HexColor"]).HexColor("#94A3B8"),
        spaceBefore=8, spaceAfter=10,
    ))


def main():
    d = TeacherDoc(
        OUT,
        "Volume 4 — Deep Dive: ChatInterface.jsx + api.py (line-by-line)",
        "VOLUME 4",
    )
    d.cover(
        [
            "The two hardest files in the project — explained slowly.",
            "Chat UI (frontend) talks to FastAPI kitchen (backend).",
            "Read with the real files open side-by-side.",
        ]
    )

    d.h1("How these two files are best friends")
    d.ascii(
        """
ChatInterface.jsx                         api.py
─────────────────                         ──────
User types / speaks                       Receives HTTP
   │                                         │
handleSend / onSendMessage  ──POST──►  /stream-chat
   │                                   retrieve_bns_context
messages[] grow (stream)  ◄──chunks──  Groq astream yield
   │
speakText (optional TTS)
"""
    )
    d.p(
        "Analogy: ChatInterface is the customer at the counter. api.py is the kitchen. "
        "Messages are plates of food coming out one bite at a time (streaming)."
    )
    d.page_break()

    # ========== CHAT INTERFACE ==========
    d.h1("PART A — ChatInterface.jsx (~680 lines)")
    d.p(
        "This file draws the chat screen: empty-state suggestions, bubbles, typing dots, "
        "composer box, mute, mic, send. It does NOT own the big streaming fetch — that lives in App.tsx "
        "via onSendMessage. But it DOES own voice-note upload to /voice-message."
    )

    d.file_chapter(
        path="ChatInterface.jsx — imports + component signature (lines 1–9)",
        purpose=[
            "Bring in React tools, icons, motion, voice helpers, API URL.",
            "Declare the ChatInterface function and its props (gifts from App).",
        ],
        where_used=["Rendered by App.tsx when mode is chat or report."],
        when_runs=["Whenever /app shows the chat tool; re-renders on prop/state change."],
        code_lines=[
            "import React, { useState, useEffect, useRef } from 'react';",
            "import { Send, Mic, Volume2, ... } from 'lucide-react';",
            "import { motion, AnimatePresence } from 'framer-motion';",
            "import { useVoiceAssistant } from '../hooks/useVoiceAssistant';",
            "import API_BASE_URL from '../config/api';",
            "const ChatInterface = ({ messages, setMessages, onSendMessage, loading, role, user, mode, voiceAssistantEnabled = true }) => {",
        ],
        line_explanations=[
            ("useState / useEffect / useRef", "React hooks: memory, side-effects, sticky boxes that don't re-render by themselves."),
            ("lucide-react icons", "Pretty pictures for buttons (Send, Volume, Shield...)."),
            ("framer-motion", "Smooth fade/slide for bubbles and banners."),
            ("useVoiceAssistant", "Custom hook for listen/process voice commands."),
            ("API_BASE_URL", "Backend address for /voice-message uploads."),
            ("messages / setMessages", "Chat history array owned by App — passed down."),
            ("onSendMessage", "Callback: child asks parent to send text to backend."),
            ("loading", "True while waiting/streaming AI answer."),
            ("mode", "'chat' or 'report' (FIR) changes colors and prompts."),
            ("voiceAssistantEnabled = true", "Default prop: voice on unless settings turn it off."),
            ("user", "Name, photo, role for greetings and prompt packs."),
        ],
        analogy="Props are lunch boxes App packs for ChatInterface. Hooks are tools in ChatInterface's own pocket.",
        if_delete="No chat UI import — App crashes when rendering chat.",
        memory="Props down, events up. Child never secretly calls Groq for main chat — parent does.",
        quiz=[
            "Who owns the messages array?",
            "What does onSendMessage do?",
            "Which prop switches FIR styling?",
        ],
        interview=[
            "Explain controlled components and lifting state.",
            "Why pass a callback instead of fetching inside the child?",
        ],
    )

    d.file_chapter(
        path="ChatInterface.jsx — local state + copy + formatMessage (10–34)",
        purpose=["Local UI memory: typed text, FIR history string, copy feedback; bold **markdown** helper."],
        where_used=["Composer, copy button, bubble rendering."],
        when_runs=["On every keystroke / copy click / when painting bubbles."],
        code_lines=[
            "const [input, setInput] = useState('');",
            "const [reportHistory, setReportHistory] = useState('');",
            "const [copiedIndex, setCopiedIndex] = useState(null);",
            "navigator.clipboard.writeText(text).then(() => { setCopiedIndex(index); setTimeout(..., 2000); });",
            "const parts = text.split(/(\\*\\*[^*]+\\*\\*)/g);",
            "return bold HTML for **bold** parts",
        ],
        line_explanations=[
            ("input", "What you type in the textarea."),
            ("reportHistory", "String diary of voice FIR turns for /voice-message."),
            ("copiedIndex", "Which bubble shows a green check after copy."),
            ("clipboard.writeText", "Browser API copies text."),
            ("setTimeout 2000", "Reset check icon after 2 seconds."),
            ("formatMessage split regex", "Find **like this** pieces and wrap them in a bold HTML tag."),
            ("part.slice(2,-2)", "Remove the ** markers."),
        ],
        analogy="input is your pencil draft. formatMessage is a highlighter for bold words.",
        if_delete="No typing box memory / ugly plain text / no copy feedback.",
        memory="Local state = this room's sticky notes. messages = hallway bulletin board (App).",
        quiz=["How long does the check icon stay?", "What does formatMessage do to **Hello**?"],
        interview=["Clipboard API and secure contexts (https)", "Why not use react-markdown everywhere here?"],
    )

    d.file_chapter(
        path="ChatInterface.jsx — greeting + rights ticker (36–66)",
        purpose=["Time-based greeting; rotating rights labels (interval)."],
        where_used=["Empty-state headline uses greeting."],
        when_runs=["On mount: set greeting once; interval every 2s for rights index."],
        code_lines=[
            "const hour = new Date().getHours();",
            "if (hour < 12) setGreeting('Good Morning'); ...",
            "const interval = setInterval(() => setRightIndex((prev) => (prev + 1) % rights.length), 2000);",
            "return () => clearInterval(interval);",
        ],
        line_explanations=[
            ("useEffect []", "Run once after first paint."),
            ("getHours", "0–23 clock hour."),
            ("setInterval", "Repeat forever until cleared."),
            ("% rights.length", "Loop index back to 0 like a carousel."),
            ("cleanup clearInterval", "Stop timer when component unmounts — prevents leaks."),
        ],
        analogy="A classroom clock that says morning/afternoon, and a rotating poster of rights.",
        if_delete="Greeting stuck or timers keep running after leave (memory leak).",
        memory="Always clean up intervals in useEffect return.",
        quiz=["What hour starts Good Evening?", "Why clearInterval?", "What does % do?"],
        interview=["useEffect cleanup", "Memory leaks in SPAs"],
    )

    d.file_chapter(
        path="ChatInterface.jsx — prompts by role + FIR packs (68–147)",
        purpose=["Pick suggestion cards and quick actions based on mode and user.role."],
        where_used=["Empty state when messages.length === 0."],
        when_runs=["Every render; derived from mode/role."],
        code_lines=[
            "const isFirMode = mode === 'report';",
            "const legalPrompts = { Citizen:[...], Advocate:[...], Police:[...], Student:[...], Other:[...] };",
            "const suggestionPrompts = isFirMode ? firPrompts : (legalPrompts[user?.role] || legalPrompts.Citizen);",
            "const quickActions = isFirMode ? firQuickActions : (legalQuickActions[user?.role] || legalQuickActions.Citizen);",
        ],
        line_explanations=[
            ("isFirMode", "Shortcut boolean for red FIR UI."),
            ("legalPrompts[role]", "Different starter questions per role backpack."),
            ("user?.role", "Optional chaining — safe if user missing."),
            ("|| Citizen", "Fallback pack if unknown role."),
            ("firPrompts", "FIR-focused starters when mode=report."),
            ("quickActions", "Smaller chips with label + query string."),
        ],
        analogy="Different homework worksheets for each class; FIR class gets a red worksheet.",
        if_delete="Empty state has nothing useful to click.",
        memory="Derive UI lists from role+mode — don't hardcode one list.",
        quiz=["What prompts show for Student in chat mode?", "What if role is undefined?"],
        interview=["Personalization UX", "Optional chaining"],
    )

    d.file_chapter(
        path="ChatInterface.jsx — refs + voice command handler (149–187)",
        purpose=["Hold MediaRecorder pieces without re-render; route voice commands."],
        where_used=["Recording + useVoiceAssistant."],
        when_runs=["On voice events."],
        code_lines=[
            "const mediaRecorderRef = useRef(null);",
            "const audioChunksRef = useRef([]);",
            "const bottomRef = useRef(null);",
            "switch (command.type) { case 'clear': setMessages([]); ... case 'send': handleSend(queryText); }",
            "const voiceAssistant = useVoiceAssistant(voiceAssistantEnabled, handleVoiceCommand);",
        ],
        line_explanations=[
            ("useRef", "Box that keeps the same object across renders."),
            ("mediaRecorderRef", "Points at the live MediaRecorder instance."),
            ("audioChunksRef", "Array collecting audio blobs."),
            ("bottomRef", "Dummy div at list bottom for auto-scroll."),
            ("speechSynthesis.cancel", "Stop talking when user speaks again."),
            ("clear command", "Wipe chat + reportHistory."),
            ("send/query", "Put text in input and send immediately."),
            ("useVoiceAssistant(...)", "Hook gets enable flag + command callback."),
        ],
        analogy="Refs are backpack pockets; state is a scoreboard on the wall. Voice commands are remote-control buttons.",
        if_delete="Recording/scroll/voice routing breaks.",
        memory="Ref = remember quietly. State = remember and redraw.",
        quiz=["Does changing a ref re-render?", "What does clear do?", "Who calls handleVoiceCommand?"],
        interview=["useRef vs useState", "Command pattern for voice UIs"],
    )

    d.file_chapter(
        path="ChatInterface.jsx — auto-scroll + TTS after loading (189–286)",
        purpose=["Scroll to newest message; speak AI reply when loading finishes."],
        where_used=["UX polish while chatting."],
        when_runs=["When messages/loading/recording change; when loading goes true→false."],
        code_lines=[
            "bottomRef.current?.scrollIntoView({ behavior: 'smooth' });",
            "if (loading) setWasLoading(true);",
            "if (!loading && wasLoading && lastMessage.sender === 'ai' && !isMuted) speakText(lastMessage.text, true);",
            "const utterance = new SpeechSynthesisUtterance(cleanedText);",
            "utterance.rate = 0.95; window.speechSynthesis.speak(utterance);",
        ],
        line_explanations=[
            ("scrollIntoView", "Keep latest bubble visible."),
            ("wasLoading flag", "Detect the moment loading ends (edge trigger)."),
            ("speakText", "Browser reads text aloud."),
            ("cleanText regexes", "Strip **, #, lists so speech sounds natural."),
            ("en-IN / en-US voice pick", "Prefer Indian/English voices."),
            ("onvoiceschanged", "Some browsers load voices late."),
            ("toggleMute", "Flip mute; cancel speech when muting."),
        ],
        analogy="Auto-scroll is an elevator to the newest floor. TTS is a friend reading the letter aloud.",
        if_delete="User must scroll manually; no spoken answers.",
        memory="wasLoading catches the 'just finished' moment.",
        quiz=["Why clean markdown before speak?", "What happens if isMuted?"],
        interview=["SpeechSynthesis quirks", "Detecting state transitions in React"],
    )

    d.file_chapter(
        path="ChatInterface.jsx — MediaRecorder upload /voice-message (288–370)",
        purpose=["Record mic audio, POST to backend Whisper endpoint, update bubbles."],
        where_used=["Legacy/manual recording path (also VoiceAssistantButton path exists)."],
        when_runs=["startRecording → stopAndSendRecording."],
        code_lines=[
            "const stream = await navigator.mediaDevices.getUserMedia({ audio: true });",
            "mediaRecorderRef.current = new MediaRecorder(stream);",
            "const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });",
            "formData.append('file', audioFile);",
            "await fetch(`${API_BASE_URL}/voice-message`, { method: 'POST', body: formData });",
            "onSendMessage(textToSend); // handleSend",
        ],
        line_explanations=[
            ("getUserMedia", "Ask permission for microphone."),
            ("ondataavailable", "Push audio pieces into array."),
            ("Blob / File", "Package audio for upload."),
            ("FormData", "Multipart form like an HTML file form."),
            ("replace processing bubble", "Update 'Audio Sent...' with real transcript."),
            ("append AI answer", "Second bubble for reply."),
            ("handleSend", "Clears input and calls parent onSendMessage for text chat."),
            ("trim guard", "Ignore empty sends."),
        ],
        analogy="Record a voice note on WhatsApp → server types it → lawyer replies.",
        if_delete="Mic recording upload path breaks.",
        memory="FormData = envelope with a file attached.",
        quiz=["Which endpoint receives audio?", "What does handleSend call?", "Why alert on mic deny?"],
        interview=["MediaRecorder constraints", "Multipart uploads"],
    )

    d.file_chapter(
        path="ChatInterface.jsx — JSX UI: banners, empty state, bubbles, composer (372–681)",
        purpose=["Actually draw everything on screen."],
        where_used=["Browser paint of chat."],
        when_runs=["Every re-render."],
        code_lines=[
            "messages.length === 0 && ( <suggestion buttons onClick={() => handleSend(text)} /> )",
            "messages.map((msg, idx) => ( bubble + copy + speak ))",
            "loading && ( typing-dot dots )",
            "<textarea value={input} onKeyDown={Enter => handleSend()} />",
            "<VoiceAssistantButton onClick={voiceAssistant.toggleListening} />",
            "<button onClick={() => handleSend()} disabled={!input.trim() || loading}>",
        ],
        line_explanations=[
            ("FIR banner red vs teal", "Mode chip tells user which tool personality is active."),
            ("empty state", "Only when no messages — onboarding."),
            ("suggestion onClick", "Fill + send in one tap."),
            ("map bubbles", "User right-aligned; AI left-aligned."),
            ("key={idx}", "React list identity (index ok for append-only chat)."),
            ("group-hover copy", "Copy button appears on hover."),
            ("typing-dot", "CSS animation while loading."),
            ("textarea auto height", "Grow until max 128px."),
            ("Enter vs Shift+Enter", "Send vs newline."),
            ("placeholder by role", "Hint text personalized."),
            ("disabled send", "Cannot send empty or while loading."),
            ("export default", "App can import ChatInterface."),
        ],
        analogy="The stage set: empty stage has posters; full stage has dialogue bubbles; bottom is the microphone stand.",
        if_delete="No visible chat UI.",
        memory="JSX is the drawing instructions React follows.",
        quiz=["When is empty state shown?", "What key sends a message?", "Why disable Send when loading?"],
        interview=["List keys", "Accessible chat composer patterns"],
    )

    d.h1("ChatInterface complete flow")
    d.ascii(
        """
Empty suggestions click ──► handleSend(text) ──► onSendMessage (App)
App streams AI into messages[] ──► ChatInterface re-renders bubbles
loading true→false ──► speakText (if not muted)
Mic VoiceAssistant ──► commands / or MediaRecorder ──► POST /voice-message
"""
    )
    d.page_break()

    # ========== API.PY ==========
    d.h1("PART B — api.py (~320 lines)")
    d.p(
        "This is the kitchen. It loads secrets, opens Chroma, wakes Groq, and exposes HTTP doors "
        "(endpoints). Each door solves one job: stream chat, FIR interview, voice, PDFs, DOCX."
    )

    d.file_chapter(
        path="api.py — imports + env + FastAPI + CORS (1–39)",
        purpose=["Load libraries; read GROQ_API_KEY; create app; allow browser cross-origin calls."],
        where_used=["Uvicorn imports api:app."],
        when_runs=["Once at process start."],
        code_lines=[
            "load_dotenv()",
            "GROQ_API_KEY = os.getenv('GROQ_API_KEY', '').strip()",
            "app = FastAPI(title='Nyay Sahayak API', ...)",
            "app.add_middleware(CORSMiddleware, allow_origins=['*'], ...)",
        ],
        line_explanations=[
            ("os / json / shutil", "Files, JSON, copy streams."),
            ("chromadb", "Vector DB client."),
            ("fastapi / StreamingResponse / FileResponse", "Web framework + special responses."),
            ("CORSMiddleware", "Let Vercel frontend call Render API."),
            ("allow_origins *", "Easy for demos; tighten in serious production."),
            ("pydantic BaseModel", "Validate JSON bodies."),
            ("ChatGroq / Groq", "LLM + Whisper clients."),
            ("FPDF / Document", "Make PDF and Word files."),
            ("load_dotenv", "Read backend/.env into environment."),
            ("strip()", "Remove accidental spaces on the key."),
            ("warning if missing key", "Print help instead of silent fail."),
        ],
        analogy="Opening the restaurant: unlock safe (API key), unlock doors for delivery apps (CORS), hang the open sign (FastAPI).",
        if_delete="Server cannot start or browsers blocked by CORS.",
        memory="CORS = permission slip for other websites.",
        quiz=["Where does GROQ_API_KEY come from?", "What does allow_origins * mean?"],
        interview=["CORS preflight", "Secret management"],
    )

    d.file_chapter(
        path="api.py — Chroma + Groq model boot (41–82)",
        purpose=["Connect persistent Chroma; create draft_llm, vision_llm, groq_client."],
        where_used=["All endpoints that need RAG or AI."],
        when_runs=["Startup try/except blocks."],
        code_lines=[
            "chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)",
            "bns_db = chroma_client.get_collection('bns_law')  # or create",
            "draft_llm = ChatGroq(..., model_name=GROQ_TEXT_MODEL, temperature=0.3)",
            "groq_client = Groq(api_key=GROQ_API_KEY)",
        ],
        line_explanations=[
            ("BASE_DIR / CHROMA_PATH", "Folder nyay_memory next to api.py."),
            ("PersistentClient", "Save vectors on disk between restarts."),
            ("legal_cases legacy", "Old collection kept for compatibility."),
            ("bns_law", "Real RAG collection from ingest.py."),
            ("empty collection message", "Reminds you to run ingest."),
            ("temperature 0.3", "Mostly focused, a little flexible."),
            ("vision_llm", "Prepared for image/PDF vision tasks."),
            ("None fallbacks", "If key missing, endpoints can return friendly errors."),
        ],
        analogy="Stock the fridge (Chroma) and wake two chefs (text + vision) plus an ear (Whisper client).",
        if_delete="RAG and AI all offline.",
        memory="bns_law = the law flashcard cabinet.",
        quiz=["Collection name for BNS?", "What temperature is used?", "What if Chroma fails?"],
        interview=["Persistent vs ephemeral vector stores", "Model temperature"],
    )

    d.file_chapter(
        path="api.py — retrieve_bns_context (85–105)",
        purpose=["The R in RAG: search similar chunks for the user question."],
        where_used=["generate_live_response."],
        when_runs=["Every streaming chat request."],
        code_lines=[
            "results = bns_db.query(query_texts=[query], n_results=min(n_results, bns_db.count()))",
            "docs = (results.get('documents') or [[]])[0]",
            "blocks.append(f'[BNS excerpt — page {page}]\\n{doc}')",
            "return '\\n\\n---\\n\\n'.join(blocks)",
        ],
        line_explanations=[
            ("if not bns_db", "Safety: no DB → empty string."),
            ("count()==0", "Nothing ingested yet."),
            ("query_texts", "Chroma finds nearest chunks by meaning."),
            ("n_results", "How many flashcards to pull (default 5)."),
            ("metadatas page", "Remember PDF page for citations."),
            ("join with ---", "Separate excerpts clearly for the LLM."),
            ("except return ''", "Never crash the chat if retrieval fails."),
        ],
        analogy="Librarian pulls 5 sticky notes that smell most like your question.",
        if_delete="Answers float without law book grounding.",
        memory="Retrieve BEFORE generate.",
        quiz=["Default n_results?", "What if retrieval errors?"],
        interview=["Top-k retrieval", "Grounding vs hallucination"],
    )

    d.file_chapter(
        path="api.py — Pydantic models (107–133)",
        purpose=["Declare shapes of JSON bodies FastAPI accepts."],
        where_used=["Endpoint function parameters."],
        when_runs=["On each request validation."],
        code_lines=[
            "class ChatRequest(BaseModel):",
            "    message: str",
            "    history: str = ''",
            "class ReportChatRequest(BaseModel):",
            "    user_input: str",
            "    history: str = ''",
        ],
        line_explanations=[
            ("BaseModel", "Pydantic class = schema."),
            ("required fields", "message / user_input must exist."),
            ("defaults", "history can be empty string."),
            ("UserQuery / Rent / Notice", "Other endpoints' payloads."),
            ("auto 422 errors", "Bad JSON → FastAPI rejects clearly."),
        ],
        analogy="Order forms: if you forget 'message', the waiter sends the form back.",
        if_delete="Messy manual dict parsing and weaker validation.",
        memory="Pydantic = bouncer checking IDs at the door.",
        quiz=["Is history required?", "What model does /stream-chat use?"],
        interview=["Schema validation benefits", "OpenAPI docs from FastAPI"],
    )

    d.file_chapter(
        path="api.py — generate_live_response + POST /stream-chat (139–192)",
        purpose=["Build RAG prompt; stream Groq tokens; expose /stream-chat."],
        where_used=["App.tsx chat fetch."],
        when_runs=["Each user legal question."],
        code_lines=[
            "bns_context = retrieve_bns_context(message, n_results=5)",
            "full_prompt = system_prompt + context_block + history + message",
            "async for chunk in draft_llm.astream(full_prompt):",
            "    if chunk.content: yield chunk.content",
            "@app.post('/stream-chat')",
            "return StreamingResponse(..., media_type='text/plain')",
        ],
        line_explanations=[
            ("system_prompt", "Job rules: ground in BNS, language match, disclaimer."),
            ("context_block", "Insert retrieved excerpts or a 'none found' note."),
            ("history", "Earlier conversation for continuity."),
            ("async for astream", "Receive tokens as produced."),
            ("yield", "Generator sends pieces to StreamingResponse."),
            ("missing draft_llm", "Yield a warning string."),
            ("@app.post", "Register HTTP POST route."),
            ("text/plain", "Body is raw text chunks, not JSON object stream."),
        ],
        analogy="Chef reads recipe cards (excerpts), then narrates the dish live over intercom (stream).",
        if_delete="Main product chat dies.",
        memory="yield = pass bites to the customer now.",
        quiz=["Media type of stream?", "Where do excerpts enter the prompt?", "What if key missing?"],
        interview=["Streaming UX", "Prompt design for RAG", "SSE vs chunked HTTP"],
    )

    d.file_chapter(
        path="api.py — POST /file-report-interview (197–220)",
        purpose=["FIR conversational interview; one question at a time; non-streaming JSON."],
        where_used=["App when mode==='report'."],
        when_runs=["Each FIR user turn."],
        code_lines=[
            "res = draft_llm.invoke(full_prompt)",
            "return {'answer': res.content, 'status': 'active'}",
        ],
        line_explanations=[
            ("SHO persona", "Empathetic police officer style."),
            ("ONE question rule", "Keeps FIR structured."),
            ("REPORT_COLLECTED", "Magic phrase when enough facts gathered."),
            ("invoke vs astream", "Wait for full answer, return once."),
            ("language match rules", "Mirror user language."),
        ],
        analogy="A careful uncle asking one question, writing notes, then the next question.",
        if_delete="FIR mode backend fails.",
        memory="Interview ≠ lecture. One Q at a time.",
        quiz=["Streaming or JSON?", "What special end phrase?"],
        interview=["Conversation state design", "Safety for complaint tools"],
    )

    d.file_chapter(
        path="api.py — POST /voice-message (225–266)",
        purpose=["Save upload → Whisper transcript → short LLM reply → JSON."],
        where_used=["ChatInterface FormData upload / voice hook."],
        when_runs=["After audio recorded."],
        code_lines=[
            "shutil.copyfileobj(file.file, buffer)",
            "transcription = groq_client.audio.transcriptions.create(model='whisper-large-v3', ...)",
            "user_text = transcription.text",
            "res = draft_llm.invoke(...); ai_response = res.content",
            "os.remove(temp_filename)",
            "return {'user_text': user_text, 'answer': ai_response}",
        ],
        line_explanations=[
            ("UploadFile", "FastAPI parses multipart file."),
            ("Form history", "Extra form field for chat context."),
            ("temp file", "Whisper API wants a file-like path/bytes."),
            ("whisper-large-v3", "Speech-to-text model."),
            ("no forced language=en", "Allows Hindi detection."),
            ("temperature 0.0", "Deterministic transcription."),
            ("delete temp", "Clean disk — important!"),
            ("error JSON", "Always return shape UI expects."),
        ],
        analogy="Secretary types your voice note, asks lawyer, deletes the cassette.",
        if_delete="Voice notes fail.",
        memory="Upload → Whisper → LLM → delete temp.",
        quiz=["Model for STT?", "Why delete temp file?", "Return keys?"],
        interview=["PII in audio", "Temp file hygiene"],
    )

    d.file_chapter(
        path="api.py — document generators + __main__ (271–318)",
        purpose=["LLM extracts notice fields → PDF; rent fields → DOCX; uvicorn entry."],
        where_used=["DocGenModal / useLegalAI; Render start."],
        when_runs=["On generate click; or python api.py locally."],
        code_lines=[
            "details = json.loads(content)",
            "pdf.output('Legal_Notice.pdf'); return FileResponse(...)",
            "doc.save('Rent_Agreement.docx'); return FileResponse(...)",
            "uvicorn.run(app, host='0.0.0.0', port=port)",
        ],
        line_explanations=[
            ("JSON ONLY prompt", "Ask model for structured fields."),
            ("strip markdown fences", "Remove ```json wrappers."),
            ("FPDF cells", "Write PDF text."),
            ("python-docx", "Write Word paragraphs."),
            ("FileResponse", "Browser downloads file."),
            ("host 0.0.0.0", "Listen on all interfaces in cloud."),
            ("PORT env", "Render injects port number."),
        ],
        analogy="Fill-in form → office printer spits PDF/Word → courier delivers file.",
        if_delete="Doc downloads / direct python start break.",
        memory="FileResponse = attach file to the reply.",
        quiz=["Which lib makes PDF?", "Why host 0.0.0.0?", "What env sets port?"],
        interview=["Validating LLM JSON safely", "12-factor PORT binding"],
    )

    d.h1("End-to-end: one user question")
    d.ascii(
        """
1 User clicks suggestion in ChatInterface
2 handleSend → App onSendMessage
3 App POST /stream-chat {message, history}
4 retrieve_bns_context(message) → top chunks
5 full_prompt = rules + chunks + history + question
6 draft_llm.astream yields tokens
7 StreamingResponse sends text/plain pieces
8 App appends into messages AI bubble
9 ChatInterface re-renders + optional speakText
"""
    )

    d.h1("Volume 4 practice")
    d.bullets(
        [
            "Open ChatInterface.jsx and highlight every useState in yellow.",
            "Open api.py and highlight retrieve_bns_context + /stream-chat in green.",
            "Explain streaming to a friend using the restaurant intercom analogy.",
            "Break mic permission on purpose and watch the alert — then fix it.",
            "Interview drill: 'Walk me through a chat message from UI to Groq and back.'",
        ]
    )
    d.p(
        "You finished Volume 4. Together with Volumes 1–3 you can explain the shop window, "
        "the rooms, and the kitchen. That is interview power."
    )

    # Fix HRFlowable usage - use proper import at top of block function instead
    print("WROTE", d.build())


if __name__ == "__main__":
    main()
