"""Volume 2 — Components, pages, hooks."""
from __future__ import annotations
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from teacher_lib import TeacherDoc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "teacher", "Nyay_Sahayak_Teacher_Volume_2_UI_Components.pdf")


def chapter(d, **kwargs):
    d.file_chapter(**kwargs)


def main():
    d = TeacherDoc(OUT, "Volume 2 — UI Components, Pages & Hooks", "VOLUME 2")
    d.cover([
        "Every screen brick: Navbar, Sidebar, Chat, Quiz, Mapper...",
        "Pages: Home, Auth • Hooks: useLegalAI, useVoiceAssistant",
        "Parent↔child props • events • re-renders",
    ])

    d.h1("How React components talk (kid version)")
    d.p("A <b>component</b> is a custom Lego brick that draws UI.")
    d.p("<b>Props</b> are gifts from parent to child (read-only for the child).")
    d.p("<b>State</b> is the child's (or parent's) own memory that can change.")
    d.p("<b>Re-render</b> means React redraws the brick when memory/props change.")
    d.ascii(
        """
App (parent)  --props: user, mode, setMode-->  Sidebar (child)
App (parent)  --props: messages, onSend------>  ChatInterface (child)
Sidebar click setMode('quiz')  -->  App state mode changes  -->  Quiz appears
"""
    )
    d.page_break()

    d.h1("FOLDER: frontend/src/pages")
    chapter(
        d,
        path="frontend/src/pages/HomePage.jsx",
        purpose=["Marketing landing page: hero, features, how-it-works, why-us, Footer."],
        where_used=["App route '/'."],
        when_runs=["When user visits the site root."],
        code_lines=[
            "const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));",
            "const toggleDarkMode = () => { ... localStorage.setItem('theme', ...) };",
            "navigate('/login')",
            "<Navbar /> <header hero> <section features> <Footer />",
        ],
        line_explanations=[
            ("useNavigate", "React Router helper to change pages in code."),
            ("darkMode state", "Tracks theme for Navbar toggle + scales color."),
            ("useScroll / useTransform", "Framer Motion parallax for hero."),
            ("fadeUp variants", "Reusable animation recipe for sections."),
            ("surface-card", "Feature cards using global CSS class."),
            ("navigate('/login')", "CTA buttons send visitors to auth."),
        ],
        analogy="The storefront poster and window display before you enter the shop.",
        if_delete="No landing page; '/' route breaks.",
        memory="HomePage = first impression.",
        quiz=["Which route renders HomePage?", "What does toggleDarkMode write?", "Name one section id used for scroll."],
        interview=["What is a landing page vs app shell?", "Client-side navigation benefits?"],
    )

    chapter(
        d,
        path="frontend/src/pages/AuthPage.jsx",
        purpose=["Login and Sign Up with email/password + Google; role picker on Sign Up."],
        where_used=["App route '/login'."],
        when_runs=["When user opens login or after CTA."],
        code_lines=[
            "const [isLogin, setIsLogin] = useState(true);",
            "const [formData, setFormData] = useState({ name:'', email:'', password:'', role:'' });",
            "createUserWithEmailAndPassword(auth, email, password)",
            "signInWithEmailAndPassword(auth, email, password)",
            "saveRole(formData.role) // sessionStorage pending_role",
        ],
        line_explanations=[
            ("isLogin", "Toggle between Login tab and Sign Up tab."),
            ("formData", "Stores typed fields including role."),
            ("ROLES array", "Citizen, Advocate, Police, Student, Other buttons."),
            ("createUserWithEmailAndPassword", "Firebase creates a new account."),
            ("updateProfile", "Sets displayName after signup."),
            ("handleGoogleLogin prop", "Calls App's Google popup function."),
            ("pending_role", "Remembers role until auth finishes."),
            ("error state", "Shows friendly red error box."),
        ],
        analogy="School admission desk: fill form, pick house (role), get ID card.",
        if_delete="Users cannot sign in via UI.",
        memory="AuthPage = door with locks.",
        quiz=["Is role required on Login or Sign Up?", "Where is pending_role stored?", "Name two Firebase auth methods used."],
        interview=["Email auth vs OAuth Google?", "Why store pending role in sessionStorage?"],
    )
    d.page_break()

    d.h1("FOLDER: frontend/src/components")
    d.ascii(
        """
components/
├── Navbar.jsx, Footer.jsx, BootScreen.jsx
├── Sidebar.jsx, RoleSelectGate.jsx
├── ChatInterface.jsx, FileReport.jsx
├── IpcBnsMapper.jsx, LawStudentQuiz.jsx, GovServices.jsx
├── AnimatedJusticeScales.jsx, Voice*
├── Login.jsx, AdvocateDashboard.jsx (legacy/extra)
└── Modals/ SettingsModal, DocGenModal
"""
    )

    chapter(
        d,
        path="frontend/src/components/Navbar.jsx",
        purpose=["Top navigation on HomePage: logo, section links, theme toggle, Start button."],
        where_used=["HomePage.jsx"],
        when_runs=["On landing page; listens to scroll for glass background."],
        code_lines=[
            "const [scrolled, setScrolled] = useState(false);",
            "useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24));",
            "scrollToSection('#features')",
            "toggleDarkMode()",
        ],
        line_explanations=[
            ("scrolled", "True after user scrolls — stronger background."),
            ("scrollToSection", "Smooth scroll to page anchors."),
            ("mobile menu state", "Hamburger opens overlay links."),
            ("props darkMode/toggleDarkMode", "Parent HomePage owns theme logic."),
        ],
        analogy="The top menu board in a museum.",
        if_delete="Landing page loses navigation and theme toggle.",
        memory="Navbar = north star bar.",
        quiz=["Who passes toggleDarkMode?", "What changes when scrolled?", "Does Navbar appear inside /app?"],
        interview=["Controlled theme in parent vs navbar?", "Accessibility for mobile menus?"],
    )

    chapter(
        d,
        path="frontend/src/components/Footer.jsx",
        purpose=["Site footer with brand blurb, quick links, GitHub URL, copyright."],
        where_used=["HomePage.jsx"],
        when_runs=["When landing page renders."],
        code_lines=[
            "const GITHUB_URL = 'https://github.com/knarendrakumar187/Nyay-Sahayak-react-UI';",
            "<a href={GITHUB_URL} target='_blank' rel='noopener noreferrer'>",
        ],
        line_explanations=[
            ("GITHUB_URL constant", "Single place for repo link."),
            ("target=_blank", "Open new tab."),
            ("relnoopener", "Security best practice for new tabs."),
            ("Quick Links", "Scroll buttons + router Link to /login."),
        ],
        analogy="The back cover of a book with credits and website.",
        if_delete="No footer links/GitHub on landing.",
        memory="Footer = feet of the page.",
        quiz=["What does noopener do?", "Is Footer used in /app chat?"],
        interview=["Why rel=noopener noreferrer?"],
    )

    chapter(
        d,
        path="frontend/src/components/BootScreen.jsx",
        purpose=["Short splash animation before the app UI appears."],
        where_used=["App.tsx while booting."],
        when_runs=["On first load until boot timer/state finishes."],
        code_lines=["// shows logo / scales animation", "// then App sets bootDone true"],
        line_explanations=[
            ("boot state in App", "Controls whether BootScreen is visible."),
            ("animation", "Brand moment using motion / scales."),
        ],
        analogy="Movie studio logo before the film starts.",
        if_delete="App jumps straight to UI (fine functionally, less polish).",
        memory="Boot = boots up.",
        quiz=["Is BootScreen a route?", "Who decides when it ends?"],
        interview=["Pros/cons of splash screens?"],
    )

    chapter(
        d,
        path="frontend/src/components/AnimatedJusticeScales.jsx",
        purpose=["SVG/CSS animated scales of justice for brand visuals."],
        where_used=["BootScreen, HomePage hero."],
        when_runs=["Whenever parent renders it."],
        code_lines=["export default function AnimatedJusticeScales({ className, color }) { ... }"],
        line_explanations=[
            ("props className", "Size/position from parent Tailwind classes."),
            ("props color", "Stroke color (light vs dark hero)."),
            ("animation", "Beam tilts / pans move — attention without noise."),
        ],
        analogy="A moving school emblem.",
        if_delete="Hero/boot lose the scales graphic.",
        memory="Scales = justice symbol.",
        quiz=["Name two places it appears.", "What prop changes color?"],
        interview=["SVG vs image icons tradeoffs?"],
    )

    chapter(
        d,
        path="frontend/src/components/Sidebar.jsx",
        purpose=["App left menu: user info, role-based tools, chat history, settings, logout."],
        where_used=["App.tsx /app layout."],
        when_runs=["Whenever /app is open; updates when mode/user/history change."],
        code_lines=[
            "const menuItems = getMenuForRole(user?.role);",
            "onClick={() => { setMode(item.id); onClose?.(); }}",
            "className={isActive ? 'bg-teal...' : 'text-ink-soft...'}",
        ],
        line_explanations=[
            ("getMenuForRole", "Build visible tools for this role."),
            ("setMode prop", "Tell App which tool to show."),
            ("isCollapsed", "Desktop narrow icon rail."),
            ("isOpen / onClose", "Mobile drawer + overlay."),
            ("history list", "Recent cases; load via onLoadChat."),
            ("localStorage chats", "Persisted case titles/messages per user."),
            ("Settings button", "Calls onOpenSettings."),
        ],
        analogy="The school locker hallway directory — different classes see different doors.",
        if_delete="Cannot switch tools easily; mobile nav dies.",
        memory="Sidebar = side doors.",
        quiz=["Who provides menuItems?", "What happens on tool click?", "Why darker text in light mode?"],
        interview=["Lifting state for mode", "Mobile drawer UX patterns"],
    )

    chapter(
        d,
        path="frontend/src/components/RoleSelectGate.jsx",
        purpose=["Modal forcing role choice if roleSelected is false."],
        where_used=["App.tsx overlay."],
        when_runs=["After login when role not chosen yet."],
        code_lines=[
            "ROLES.map((role) => (",
            "  <button onClick={() => onSelect(role.id)}>{role.label}</button>",
            "))",
        ],
        line_explanations=[
            ("ROLES constant", "Citizen…Other with descriptions."),
            ("onSelect prop", "App.onSelectRole persists role."),
            ("fixed overlay", "Blocks app until choice made."),
        ],
        analogy="Sorting Hat before Hogwarts classes.",
        if_delete="Users may enter without a role; menus wrong.",
        memory="Gate = must pick house.",
        quiz=["When does it show?", "Can you skip it?", "Where else can you change role?"],
        interview=["Onboarding gates vs settings"],
    )

    chapter(
        d,
        path="frontend/src/components/ChatInterface.jsx",
        purpose=["Main chat UI: suggestions, bubbles, composer, voice, markdown answers."],
        where_used=["App when mode is chat or report."],
        when_runs=["User chatting; re-renders on messages/loading."],
        code_lines=[
            "const suggestionPrompts = isFirMode ? firPrompts : (legalPrompts[user?.role] || ...);",
            "onSendMessage(input)",
            "<ReactMarkdown>{msg.text}</ReactMarkdown>",
        ],
        line_explanations=[
            ("props messages/setMessages", "Chat data owned by App."),
            ("onSendMessage", "App function that calls backend."),
            ("loading", "Shows typing dots."),
            ("role prompts", "Different starter questions per role."),
            ("isFirMode", "mode==='report' changes prompts & styles."),
            ("voiceAssistant hook", "Mic recording / TTS optional."),
            ("textarea Enter", "Send on Enter; Shift+Enter newline."),
            ("react-markdown", "Renders **bold** lists from AI."),
        ],
        analogy="WhatsApp-like chat window talking to a lawyer robot.",
        if_delete="Core product chat disappears.",
        memory="ChatInterface = conversation stage.",
        quiz=["Who owns messages state?", "What changes in FIR mode?", "Why ReactMarkdown?"],
        interview=["Controlled inputs", "Optimistic UI", "Streaming token append patterns"],
    )

    chapter(
        d,
        path="frontend/src/components/FileReport.jsx",
        purpose=["Older/alternate FIR chat experience component."],
        where_used=["May be legacy relative to ChatInterface report mode."],
        when_runs=["If imported/rendered somewhere for FIR."],
        code_lines=["// FIR interview starter messages", "// talks to backend report endpoints"],
        line_explanations=[
            ("FIR copy", "Police-officer style greeting."),
            ("report flow", "Step-by-step complaint gathering."),
        ],
        analogy="An older notebook for FIR still kept in the drawer.",
        if_delete="Check imports — primary path is Chat mode=report.",
        memory="FileReport = FIR notebook.",
        quiz=["What does FIR stand for?", "Which role should use FIR?"],
        interview=["Conversational form vs traditional form UX"],
    )

    chapter(
        d,
        path="frontend/src/components/IpcBnsMapper.jsx",
        purpose=["Search IPC↔BNS mapping using ipcBnsMap.json (no LLM guess)."],
        where_used=["App mode === 'ipc-bns'."],
        when_runs=["When user opens mapping tool and searches."],
        code_lines=[
            "import mapData from '../data/ipcBnsMap.json'",
            "const [query, setQuery] = useState('')",
            "// filter rows by IPC or BNS number / text",
        ],
        line_explanations=[
            ("json import", "Vite bundles the table into the frontend."),
            ("direction toggle", "IPC→BNS or BNS→IPC."),
            ("filter/search", "Client-side lookup — fast, offline-capable once loaded."),
            ("status badges", "new/deleted/mapped styling."),
        ],
        analogy="A giant bilingual dictionary: old word (IPC) ↔ new word (BNS).",
        if_delete="No mapping tool screen.",
        memory="Mapper = dictionary, not chatbot.",
        quiz=["Does mapping call Groq?", "About how many rows?", "Where is data from?"],
        interview=["When to use static data vs AI?", "Client-side search complexity"],
    )

    chapter(
        d,
        path="frontend/src/components/LawStudentQuiz.jsx",
        purpose=["8-question shuffled MCQ practice for BNS/IPC topics."],
        where_used=["App mode === 'quiz' (Student/Other)."],
        when_runs=["When quiz mode opens; state updates on answers."],
        code_lines=[
            "const [index, setIndex] = useState(0);",
            "const [selected, setSelected] = useState(null);",
            "const [score, setScore] = useState(0);",
            "const questions = useMemo(() => shuffle(BANK).slice(0, 8), [seed]);",
        ],
        line_explanations=[
            ("BANK", "Array of question objects with options + answer index."),
            ("shuffle", "Random order each restart."),
            ("useMemo + seed", "Rebuild deck when Restart increments seed."),
            ("onPick", "Lock choice; add score if correct."),
            ("onNext / done", "Advance or show results."),
        ],
        analogy="A pocket quiz booklet with answer key at the back.",
        if_delete="Students lose practice mode.",
        memory="Quiz = game level for law.",
        quiz=["How many questions per run?", "What does seed do?", "Which roles see quiz?"],
        interview=["useMemo vs useEffect for derived data", "Local state machine UI"],
    )

    chapter(
        d,
        path="frontend/src/components/GovServices.jsx",
        purpose=["Curated cards linking to government portals (e-Courts, RTI, etc.)."],
        where_used=["App mode === 'digital'."],
        when_runs=["When user opens Digital Seva tool."],
        code_lines=[
            "const SERVICES = [{ title, desc, url, category }]",
            "<a href={service.url} target='_blank'>",
        ],
        line_explanations=[
            ("static list", "No backend needed — just helpful links."),
            ("category filters", "complaint/service tabs."),
            ("external anchors", "Leave app to official sites."),
        ],
        analogy="A notice board of important government doors.",
        if_delete="No Seva links screen.",
        memory="GovServices = helpful arrows outside.",
        quiz=["Does this call FastAPI?", "Why target=_blank?"],
        interview=["Content curation as a product feature"],
    )

    chapter(
        d,
        path="frontend/src/components/Modals/SettingsModal.jsx",
        purpose=["Profile settings: name, role, theme, voice toggle, detail level, logout."],
        where_used=["App when isSettingsOpen."],
        when_runs=["After Settings click from Sidebar/header."],
        code_lines=[
            "setTheme('dark'|'light')",
            "setUser({ ...user, role: value, roleSelected: true })",
            "localStorage.setItem(`nyay_role_${uid}`, value)",
        ],
        line_explanations=[
            ("controlled inputs", "Values come from user state."),
            ("role select", "Updates menus immediately via App effects."),
            ("theme buttons", "Sync html class + localStorage."),
            ("voiceAssistantEnabled", "Feature flag on user object."),
            ("onLogout", "Firebase signOut + clear local state."),
        ],
        analogy="The control panel on a spaceship.",
        if_delete="Hard to change role/theme/logout cleanly.",
        memory="Settings = knobs.",
        quiz=["Where is role persisted?", "What prop closes the modal?"],
        interview=["Controlled components", "Optimistic local persistence"],
    )

    chapter(
        d,
        path="frontend/src/components/Modals/DocGenModal.jsx",
        purpose=["UI to generate legal notice / rent agreement via backend downloads."],
        where_used=["Opened from chat/actions (document helpers)."],
        when_runs=["When user requests document generation."],
        code_lines=[
            "generateLegalNotice(voiceInput) // blob PDF",
            "generateRentAgreement(form) // blob DOCX",
        ],
        line_explanations=[
            ("blob response", "File bytes returned from API."),
            ("download link", "Browser saves file locally."),
            ("useLegalAI helpers", "Wrap fetch calls."),
        ],
        analogy="A print shop button: fill details → get paper PDF.",
        if_delete="Doc generation UI gone (API may still exist).",
        memory="DocGen = printer modal.",
        quiz=["Which endpoints create files?", "What is a blob?"],
        interview=["File download patterns in browsers"],
    )

    chapter(
        d,
        path="frontend/src/components/VoiceAssistantButton.jsx + VoiceWaveform.jsx",
        purpose=["Mic button UI + animated bars while listening."],
        where_used=["ChatInterface composer area."],
        when_runs=["When voice enabled and supported."],
        code_lines=["onClick start/stop listening", "<VoiceWaveform />"],
        line_explanations=[
            ("button states", "idle / listening / processing."),
            ("waveform", "Visual feedback that mic is live."),
        ],
        analogy="Karaoke mic button with dancing equalizer.",
        if_delete="Voice UX controls missing.",
        memory="Waveform = sound dancing.",
        quiz=["When is the button hidden?", "What hook powers voice?"],
        interview=["Web Speech / MediaRecorder basics"],
    )

    chapter(
        d,
        path="frontend/src/components/Login.jsx + AdvocateDashboard.jsx",
        purpose=["Legacy/extra components from earlier iterations."],
        where_used=["May not be on main route path (AuthPage/Home replaced Login)."],
        when_runs=["Only if imported."],
        code_lines=["// older login UI", "// advocate widgets"],
        line_explanations=[
            ("legacy", "Keep awareness during code archaeology."),
            ("prefer AuthPage", "Current auth UX lives in pages/AuthPage.jsx."),
        ],
        analogy="Old toys in the attic.",
        if_delete="Safe if unused; verify no imports first.",
        memory="Legacy = yesterday's code.",
        quiz=["What is the current login page file?", "How do you check if a file is unused?"],
        interview=["Technical debt management"],
    )
    d.page_break()

    d.h1("FOLDER: frontend/src/hooks")
    chapter(
        d,
        path="frontend/src/hooks/useLegalAI.js",
        purpose=["Custom hook wrapping backend REST calls + loading/error state."],
        where_used=["App/modals that need /ask, dossier, notice, rent, FIR analyze."],
        when_runs=["When a consumer calls returned async functions."],
        code_lines=[
            "const [loading, setLoading] = useState(false);",
            "const sendMessage = async (message, context) => {",
            "  const response = await fetch(`${API_URL}/ask`, { method:'POST', body: JSON.stringify({...}) });",
            "  return await response.json();",
            "};",
        ],
        line_explanations=[
            ("custom hook", "Function starting with use that can call useState."),
            ("loading/error", "Shared UI flags for spinners/toasts."),
            ("sendMessage", "POST /ask with role/language/detail context."),
            ("FormData uploads", "analyzeDossier / analyzeFIR send files."),
            ("blob returns", "Notices/agreements downloaded as files."),
            ("try/finally", "Always clear loading even if error."),
        ],
        analogy="A remote control with buttons that talk to the kitchen (API).",
        if_delete="Those helper API calls need rewriting everywhere.",
        memory="Hooks reuse stateful logic.",
        quiz=["Why name it useLegalAI?", "Which method uploads files?", "What does finally do?"],
        interview=["Rules of Hooks", "fetch error handling patterns"],
    )

    chapter(
        d,
        path="frontend/src/hooks/useVoiceAssistant.js",
        purpose=["Microphone recording, optional STT via backend, TTS speak-back."],
        where_used=["ChatInterface when voice enabled."],
        when_runs=["On mic click / when speaking responses."],
        code_lines=[
            "navigator.mediaDevices.getUserMedia({ audio: true })",
            "MediaRecorder ... onstop upload /voice-message",
            "speechSynthesis.speak(utterance)",
        ],
        line_explanations=[
            ("getUserMedia", "Ask browser permission for mic."),
            ("MediaRecorder", "Capture audio blobs."),
            ("upload FormData", "Send to FastAPI /voice-message (Whisper)."),
            ("speechSynthesis", "Browser voice reads AI text."),
            ("isSupported flags", "Feature detect before showing UI."),
        ],
        analogy="A walkie-talkie: speak in, hear out.",
        if_delete="Voice features break.",
        memory="Voice hook = ears + mouth.",
        quiz=["What browser API gets mic access?", "Which backend model transcribes?"],
        interview=["Privacy considerations for mic access", "Fallback when STT fails"],
    )

    chapter(
        d,
        path="frontend/src/data/ipcBnsMap.json",
        purpose=["~550 row NCRB correspondence table used by IpcBnsMapper."],
        where_used=["Imported by IpcBnsMapper.jsx."],
        when_runs=["Bundled at build; searched at runtime in browser."],
        code_lines=['[{ "ipc": "420", "bns": "...", "title": "..." }, ...]'],
        line_explanations=[
            ("JSON array", "Structured rows for lookup."),
            ("no secrets", "Public legal correspondence data."),
        ],
        analogy="A printed conversion chart in your backpack.",
        if_delete="Mapper empty/broken.",
        memory="JSON = neatly labeled boxes of data.",
        quiz=["Is this queried from ChromaDB?", "Who generates it originally?"],
        interview=["Shipping static datasets in frontend bundles — pros/cons"],
    )

    d.h1("Volume 2 relationship diagram")
    d.ascii(
        """
HomePage ── Navbar
         ── Footer
         ── AnimatedJusticeScales

App ── BootScreen
    ── RoleSelectGate
    ── SettingsModal
    ── /app ── Sidebar ── getMenuForRole
           ── ChatInterface ── useVoiceAssistant
           ── LawStudentQuiz
           ── IpcBnsMapper ── ipcBnsMap.json
           ── GovServices
           ── DocGenModal ── useLegalAI
"""
    )
    d.p("End of Volume 2. Volume 3 = backend brain, deploy, and giant revision pack.")
    print("WROTE", d.build())


if __name__ == "__main__":
    main()
