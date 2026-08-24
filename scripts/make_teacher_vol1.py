"""
Generate Nyay Sahayak multi-volume beginner teacher PDFs.
Volume 1: Roots, configs, entry, App, packages
Volume 2: Components, pages, hooks, frontend config
Volume 3: Backend, deploy, master diagrams, revision pack
"""
from __future__ import annotations
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from teacher_lib import TeacherDoc

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "docs", "teacher")
os.makedirs(OUT_DIR, exist_ok=True)


def vol1():
    d = TeacherDoc(
        os.path.join(OUT_DIR, "Nyay_Sahayak_Teacher_Volume_1_Beginner_Foundations.pdf"),
        "Volume 1 — Beginner Foundations (Root → App Start)",
        "VOLUME 1",
    )
    d.cover(
        [
            "How websites work • Folder tour • Config files • package.json",
            "index.html • main.tsx • App.tsx • Firebase • Routing",
            "Read slowly. Do every Mini Quiz out loud.",
        ]
    )

    d.h1("Welcome, young coder!")
    d.p(
        "I am your personal programming teacher. You do not need to know anything yet. "
        "We will walk through Nyay Sahayak like exploring a big toy house — room by room, "
        "drawer by drawer."
    )
    d.p(
        "<b>Nyay Sahayak</b> means Justice Helper. It is a website that helps people in India "
        "understand new criminal laws (BNS), map old IPC sections, practice quizzes, and more."
    )
    d.h2("Two big buildings")
    d.ascii(
        """
┌─────────────────────┐         ┌─────────────────────┐
│  FRONTEND (React)   │  HTTP   │  BACKEND (FastAPI)  │
│  Pretty screens     │ ──────► │  Brain + law books  │
│  Lives on Vercel    │ ◄────── │  Lives on Render    │
└─────────────────────┘ stream  └─────────────────────┘
         │                               │
         ▼                               ▼
   Firebase login                 ChromaDB (BNS pieces)
   Firestore chats                Groq AI (writes answers)
"""
    )
    d.p(
        "Analogy: Frontend is the shop window. Backend is the kitchen. Firebase is the membership desk. "
        "ChromaDB is the recipe binders. Groq is the chef who cooks answers."
    )

    d.h1("Complete first execution flow (memorize this)")
    d.ascii(
        """
You open the website
        │
        ▼
index.html loads (dark theme script)
        │
        ▼
main.tsx starts React
        │
        ▼
App.tsx boots (boot screen → router)
        │
        ├─► /          HomePage (landing)
        ├─► /login     AuthPage (sign in)
        └─► /app       Protected app
                │
                ├─ Sidebar (menu by role)
                ├─ Chat / Quiz / Mapper / Seva
                └─ Settings / Role gate
                        │
                        ▼
              fetch → FastAPI /stream-chat
                        │
                        ▼
              retrieve BNS from ChromaDB
                        │
                        ▼
              Groq streams answer → UI
"""
    )
    d.page_break()

    d.h1("FOLDER: project root")
    d.p("The root is the front door of the whole house.")
    d.bullets(
        [
            "<b>frontend/</b> — everything the user sees in the browser",
            "<b>backend/</b> — Python API, AI, law database",
            "<b>docs/</b> — teaching PDFs (this series)",
            "<b>scripts/</b> — helper scripts (map builder, PDF makers)",
            "<b>README.md</b> — human instructions for humans",
            "<b>render.yaml</b> — how to host backend on Render",
            "<b>railway.json</b> — alternate hosting config",
            "<b>ncrb_raw.html</b> — raw data used once to build IPC↔BNS map",
        ]
    )

    # README
    d.file_chapter(
        path="README.md",
        purpose=[
            "A welcome letter and map for humans (not for the computer).",
            "Explains features, architecture, how to run, and live URLs.",
        ],
        where_used=["GitHub shows it on the repo homepage. Developers read it first."],
        when_runs=["Never 'runs'. It is documentation only."],
        code_lines=[
            "# Nyay Sahayak — AI Legal Assistant for India",
            "> Instant BNS-grounded legal guidance...",
            "## Live Demo",
            "## Features",
            "## Architecture",
        ],
        line_explanations=[
            ("# title", "Markdown heading — big title for the project."),
            ("> quote", "One-line sales pitch of what the app does."),
            ("## Live Demo", "Section with website and API documentation links."),
            ("## Architecture", "Explains frontend ↔ backend with a diagram."),
        ],
        analogy="Like the instruction booklet that comes with a Lego set.",
        if_delete="The app still works. New people just get confused how to run it.",
        memory="README = Read Me First.",
        quiz=[
            "Does README run in the browser?",
            "Where do you find the live website URL?",
            "Name one feature listed in README.",
        ],
        interview=[
            "What is the purpose of a README in a GitHub project?",
            "How would you explain this project in 30 seconds using the README?",
        ],
    )

    d.file_chapter(
        path="render.yaml",
        purpose=["Tells Render.com how to build and start the FastAPI backend."],
        where_used=["Render platform reads this when deploying."],
        when_runs=["During cloud deploy, not in the user's browser."],
        code_lines=[
            "services:",
            "  - type: web",
            "    name: nyay-sahayak-api",
            "    env: python",
            "    buildCommand: ...",
            "    startCommand: uvicorn api:app ...",
        ],
        line_explanations=[
            ("services:", "List of cloud services to create."),
            ("type: web", "This service is a public website/API."),
            ("env: python", "Use a Python runtime."),
            ("startCommand", "The exact command to start FastAPI with Uvicorn."),
        ],
        analogy="Like a shipping label that tells the warehouse how to assemble and open the shop.",
        if_delete="You must configure Render by hand. Deploy may fail or start wrong.",
        memory="yaml = yet another map for servers.",
        quiz=["Is render.yaml used by React?", "What does startCommand do?", "Which language runtime?"],
        interview=["What is Infrastructure-as-Code?", "Difference between buildCommand and startCommand?"],
    )

    d.file_chapter(
        path="railway.json",
        purpose=["Similar hosting hints for Railway.app (alternate cloud)."],
        where_used=["Railway deploy tooling."],
        when_runs=["Only during Railway deployment."],
        code_lines=["{", '  "build": { ... },', '  "deploy": { ... }', "}"],
        line_explanations=[
            ("build", "How to install and prepare the app."),
            ("deploy", "How to run it after build."),
        ],
        analogy="A second shipping label for a different courier company.",
        if_delete="Railway deploys need manual setup; Render still works.",
        memory="railway.json = optional train ticket for another host.",
        quiz=["Do you need both Render and Railway?", "Is this used at runtime in browser?"],
        interview=["Why might a project include multiple deploy configs?"],
    )

    d.file_chapter(
        path="ncrb_raw.html / scripts/build_ipc_bns_map.py",
        purpose=[
            "One-time tools to scrape/convert NCRB correspondence into ipcBnsMap.json.",
            "Not part of daily app runtime for users.",
        ],
        where_used=["Developer runs the script offline to regenerate mapping JSON."],
        when_runs=["Only when you rebuild the map data."],
        code_lines=[
            "# build_ipc_bns_map.py",
            "# reads raw NCRB HTML / tables",
            "# writes frontend/src/data/ipcBnsMap.json",
        ],
        line_explanations=[
            ("raw HTML", "Saved webpage content with section mapping tables."),
            ("script", "Python program that cleans and exports JSON."),
            ("ipcBnsMap.json", "The app reads this finished product."),
        ],
        analogy="Like photocopying a government chart once, then using the clean photocopy forever.",
        if_delete="You cannot easily rebuild the map; the live mapper still works if JSON remains.",
        memory="Raw = ingredients. JSON = finished cake the app eats.",
        quiz=["Does the browser load ncrb_raw.html?", "What file does the mapper actually use?"],
        interview=["Why store derived JSON instead of scraping live every request?"],
    )
    d.page_break()

    d.h1("FOLDER: frontend/ — the shop window")
    d.ascii(
        """
frontend/
├── index.html          ← first HTML door
├── package.json        ← shopping list of tools
├── vite.config.ts      ← oven settings (build tool)
├── tailwind.config.js  ← color & design tokens
├── postcss.config.js   ← CSS helper pipeline
├── vercel.json         ← frontend host rules
├── tsconfig*.json      ← TypeScript school rules
├── eslint.config.js    ← code quality police
├── .env / .env.example ← secret addresses
└── src/                ← ALL the React code
"""
    )

    d.file_chapter(
        path="frontend/package.json",
        purpose=["Lists every library and the npm scripts (dev/build/lint)."],
        where_used=["npm / Node.js reads it. Vite uses dependencies."],
        when_runs=["When you run npm install / npm run dev / npm run build."],
        code_lines=[
            '"dependencies": {',
            '  "react": "^19.2.0",',
            '  "react-dom": "^19.2.0",',
            '  "react-router-dom": "^7.12.0",',
            '  "firebase": "^12.7.0",',
            '  "framer-motion": "^12.24.11",',
            '  "lucide-react": "^0.562.0",',
            '  "react-markdown": "^10.1.0"',
            "}",
        ],
        line_explanations=[
            ("react", "The library that builds UI from components."),
            ("react-dom", "Connects React to the real browser DOM."),
            ("react-router-dom", "Changes pages without full reload (/login, /app)."),
            ("firebase", "Login (Auth) + chat storage (Firestore)."),
            ("framer-motion", "Smooth animations (boot, page fades)."),
            ("lucide-react", "Pretty icons (menu, shield, book)."),
            ("react-markdown", "Turns **bold** AI text into formatted HTML."),
            ("vite (devDependency)", "Super-fast development server and bundler."),
            ("tailwindcss", "Utility CSS classes like flex, text-teal-300."),
            ("typescript", "Optional type-checking for .tsx files."),
        ],
        analogy="A grocery list. Without it, the kitchen (npm) does not know what to buy.",
        if_delete="npm install fails. Project cannot start.",
        memory="package.json = packing list for the trip.",
        quiz=["Name 3 dependencies.", "What command starts the local server?", "Is firebase a frontend or backend package here?"],
        interview=[
            "Difference between dependencies and devDependencies?",
            "What does npm run build do in this project?",
        ],
        extra_paragraphs=[
            "<b>Scripts:</b> <i>dev</i> = Vite local server. <i>build</i> = tsc then vite build for production. "
            "<i>preview</i> = test the production build locally. <i>lint</i> = ESLint checks.",
        ],
    )

    d.file_chapter(
        path="frontend/vite.config.ts",
        purpose=["Configures Vite and enables the React plugin (JSX transform)."],
        where_used=["Vite CLI on every dev/build."],
        when_runs=["Start of npm run dev / build."],
        code_lines=[
            "import { defineConfig } from 'vite'",
            "import react from '@vitejs/plugin-react'",
            "export default defineConfig({",
            "  plugins: [react()],",
            "})",
        ],
        line_explanations=[
            ("defineConfig", "Helper so Vite config gets nice autocomplete."),
            ("@vitejs/plugin-react", "Teaches Vite how to understand JSX/TSX."),
            ("plugins: [react()]", "Turn on React support."),
        ],
        analogy="Oven settings: temperature and which baking tray to use.",
        if_delete="Vite may not compile React JSX correctly.",
        memory="Vite = very intense turbo engine for frontend.",
        quiz=["What plugin is registered?", "Is this file loaded in the browser?"],
        interview=["Why use Vite instead of older Webpack CRA setups?"],
    )

    d.file_chapter(
        path="frontend/tailwind.config.js",
        purpose=["Defines brand colors (teal/ink), fonts, shadows, animations for class names."],
        where_used=["Tailwind build scans src files and generates CSS."],
        when_runs=["During CSS build (dev and production)."],
        code_lines=[
            "darkMode: 'class',",
            "colors: {",
            "  'bg-deep': '#070C12',",
            "  accent: { gold: '#0A6B63' },",
            "}",
        ],
        line_explanations=[
            ("darkMode: 'class'", "Dark theme turns on when <html class='dark'> exists."),
            ("bg.deep", "Near-black background token for dark UI."),
            ("accent.gold", "Actually teal brand color (historical name)."),
            ("content: ['./src/...']", "Which files Tailwind should scan for class names."),
        ],
        analogy="A crayon box with named colors so every artist uses the same teal.",
        if_delete="Custom classes like bg-bg-deep stop working; design breaks.",
        memory="Tailwind config = shared crayon names.",
        quiz=["How is dark mode toggled?", "What color is accent.gold really?"],
        interview=["Explain class-based dark mode vs media prefers-color-scheme."],
    )

    d.file_chapter(
        path="frontend/postcss.config.js",
        purpose=["Connects PostCSS plugins: Tailwind + Autoprefixer."],
        where_used=["Vite CSS pipeline."],
        when_runs=["Whenever CSS is processed."],
        code_lines=["export default { plugins: { tailwindcss: {}, autoprefixer: {} } }"],
        line_explanations=[
            ("tailwindcss", "Expands utility classes into real CSS."),
            ("autoprefixer", "Adds -webkit- prefixes for older browsers."),
        ],
        analogy="A dishwasher with two soap pods: one cleans, one shines.",
        if_delete="Tailwind utilities may not compile.",
        memory="PostCSS = post-office for CSS letters.",
        quiz=["Name the two plugins.", "Does the user download postcss.config.js?"],
        interview=["What problem does Autoprefixer solve?"],
    )

    for path, purpose in [
        ("frontend/tsconfig.json", "Root TypeScript project references."),
        ("frontend/tsconfig.app.json", "TS rules for app source."),
        ("frontend/tsconfig.node.json", "TS rules for Node/Vite config files."),
        ("frontend/eslint.config.js", "Lint rules to catch React mistakes."),
        ("frontend/vercel.json", "SPA rewrite so /app routes work on Vercel refresh."),
        ("frontend/.env.example", "Template showing VITE_API_URL without secrets."),
        ("frontend/.env", "Local real API URL (do not commit secrets)."),
    ]:
        d.file_chapter(
            path=path,
            purpose=[purpose],
            where_used=["Tooling (tsc/eslint/vercel/vite)."],
            when_runs=["Build/lint/deploy/local start — not as a React component."],
            code_lines=[f"// see {path} in repo", "// configuration only"],
            line_explanations=[
                ("config file", "Gives rules to tools, not UI widgets."),
                ("VITE_API_URL", "Frontend reads backend address from env (vite)."),
                ("vercel rewrites", "Send unknown paths to index.html for client routing."),
            ],
            analogy="School rule posters on the wall — students (tools) must obey.",
            if_delete="Typecheck/lint/deploy routing may break depending on the file.",
            memory="Config files are bosses for tools, not for users.",
            quiz=[f"Is {path} rendered on screen?", "What tool reads environment variables prefixed with VITE_?"],
            interview=["Why must SPA hosts rewrite to index.html?"],
        )
    d.page_break()

    d.h1("The true start: HTML → React")
    d.file_chapter(
        path="frontend/index.html",
        purpose=["The only real HTML page. Holds #root and early dark-theme script."],
        where_used=["Browser loads this first. Vite injects the JS bundle here."],
        when_runs=["Every full page load / refresh."],
        code_lines=[
            '<html lang="en" class="dark">',
            "<script>",
            "  const theme = localStorage.getItem('theme') || 'dark';",
            "  ...",
            "</script>",
            '<div id="root"></div>',
            '<script type="module" src="/src/main.tsx"></script>',
        ],
        line_explanations=[
            ("class=\"dark\"", "Default dark mode class on the html element."),
            ("localStorage theme script", "Runs BEFORE React so no white flash."),
            ("div#root", "Empty box where React will paint the whole app."),
            ("script type=module main.tsx", "Starts the React program."),
            ("favicon / title", "Tab icon and browser tab name."),
        ],
        analogy="An empty picture frame (#root). The theme script paints the room dark before furniture arrives.",
        if_delete="Nothing loads. Browser has no entry HTML.",
        memory="#root = React's playground sandbox.",
        quiz=["What is inside #root before React runs?", "Why set theme in HTML script?", "What file does the module script load?"],
        interview=["What is a single-page application (SPA)?", "Why avoid FOUC (flash of unstyled/wrong theme)?"],
    )

    d.file_chapter(
        path="frontend/src/main.tsx",
        purpose=["The ignition key. Creates the React root and renders <App />."],
        where_used=["Loaded by index.html."],
        when_runs=["Once when the JS bundle starts."],
        code_lines=[
            "import React from 'react'",
            "import ReactDOM from 'react-dom/client'",
            "import App from './App.tsx'",
            "import './index.css'",
            "const rootElement = document.getElementById('root');",
            "if (rootElement) {",
            "  ReactDOM.createRoot(rootElement).render(",
            "    <React.StrictMode>",
            "      <App />",
            "    </React.StrictMode>,",
            "  )",
            "}",
        ],
        line_explanations=[
            ("import React", "Bring React library into this file."),
            ("react-dom/client", "Modern React 18+ root API for browsers."),
            ("import App", "Load the big boss component."),
            ("import './index.css'", "Load global Tailwind + theme CSS."),
            ("getElementById('root')", "Find the empty HTML box."),
            ("if (rootElement)", "Safety check — only render if box exists."),
            ("createRoot(...).render", "Mount React tree into the DOM."),
            ("StrictMode", "Dev helper that double-checks for risky patterns."),
            ("<App />", "Start the application UI."),
        ],
        analogy="Turning the key in a car. Engine (React) starts and drives App.",
        if_delete="Blank page forever — React never mounts.",
        memory="main.tsx = main entrance.",
        quiz=["What does StrictMode do?", "Where does App get drawn?", "Why import CSS here?"],
        interview=["Explain createRoot vs older ReactDOM.render.", "What is the React tree?"],
    )

    d.file_chapter(
        path="frontend/src/index.css",
        purpose=["Global styles, CSS variables, dark body gradients, glass cards, buttons."],
        where_used=["Imported by main.tsx — applies to whole app."],
        when_runs=["Loaded with the app; classes apply whenever elements match."],
        code_lines=[
            "@tailwind base;",
            "@tailwind components;",
            "@tailwind utilities;",
            ":root { --bg-deep: #070C12; --accent: #0A6B63; }",
            "html.dark body { background-image: radial-gradient(...); }",
            ".surface-card { ... }",
            ".dark-shell { ... }",
        ],
        line_explanations=[
            ("@tailwind layers", "Inject Tailwind's base/components/utilities."),
            (":root variables", "Shared color tokens for the brand."),
            ("html.dark body", "Pretty dark atmosphere gradients."),
            (".surface-card", "Reusable card look for feature tiles."),
            (".dark-shell", "Lets body atmosphere show through pages."),
            (".action-btn / .btn-primary-hero", "Shared button designs."),
        ],
        analogy="The house paint and wallpaper rules for every room.",
        if_delete="Ugly unstyled HTML. Brand look disappears.",
        memory="index.css = global makeup kit.",
        quiz=["What do @tailwind directives do?", "What is dark-shell for?"],
        interview=["Difference between global CSS and CSS modules?", "How does Tailwind purge unused classes?"],
    )

    d.file_chapter(
        path="frontend/src/App.css",
        purpose=["Leftover/default Vite CSS file; mostly unused vs index.css."],
        where_used=["May be unused or lightly referenced historically."],
        when_runs=["Only if imported."],
        code_lines=["/* legacy / unused styles may live here */"],
        line_explanations=[
            ("legacy file", "Older templates keep App.css; this project leans on index.css + Tailwind."),
        ],
        analogy="An old drawer that is almost empty.",
        if_delete="Usually nothing breaks if nothing imports it.",
        memory="Prefer index.css in this project.",
        quiz=["Which CSS file is the main one?", "Is App.css required?"],
        interview=["How do you decide global vs component styles?"],
    )
    d.page_break()

    d.h1("App.tsx — the brain of the frontend")
    d.p(
        "App.tsx is huge on purpose. It owns: authentication, theme, role, chat messages, "
        "which tool mode is open, boot screen, and the router."
    )
    d.ascii(
        """
App.tsx
  │
  ├─ state: user, theme, mode, messages, bootDone, auth...
  ├─ Firebase: Google login, logout, persist role
  ├─ Router pages: /  /login  /app
  └─ /app layout:
        Sidebar  +  main tool area  +  SettingsModal  +  RoleSelectGate
"""
    )

    d.file_chapter(
        path="frontend/src/App.tsx (imports + ProtectedRoute)",
        purpose=["Import libraries/components; guard /app behind login."],
        where_used=["Rendered by main.tsx."],
        when_runs=["Always while the SPA is open; re-renders when state changes."],
        code_lines=[
            "import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';",
            "const ProtectedRoute = ({ children, isAuthenticated }) => {",
            "  if (!isAuthenticated) return <Navigate to='/login' replace />;",
            "  return children;",
            "};",
        ],
        line_explanations=[
            ("BrowserRouter", "Uses the browser address bar for routes."),
            ("Routes / Route", "Map URL paths to screens."),
            ("Navigate", "Redirect helper component."),
            ("ProtectedRoute", "Bouncer: no login → go to /login."),
            ("children", "Whatever is nested inside the protected layout."),
            ("isAuthenticated", "Boolean: do we have a signed-in Firebase user?"),
            ("replace", "Replace history entry so back button is nicer."),
        ],
        analogy="A VIP club rope. Without a stamp (login), you cannot enter /app.",
        if_delete="Anyone could open /app without signing in (bad).",
        memory="ProtectedRoute = bouncer.",
        quiz=["What URL do guests get sent to?", "What does replace do?", "Who passes isAuthenticated?"],
        interview=["How do you protect routes in React Router v6/v7?", "SPA auth vs server auth?"],
    )

    d.file_chapter(
        path="frontend/src/App.tsx (AnimatedRoutes)",
        purpose=["Declares all pages and which tool shows inside /app based on mode."],
        where_used=["Inside Router in App."],
        when_runs=["On navigation and when mode/user props change."],
        code_lines=[
            "<Route path='/' element={<HomePage />} />",
            "<Route path='/login' element={<AuthPage ... />} />",
            "<Route path='/app' element={<ProtectedRoute>...Sidebar + tools...</ProtectedRoute>} />",
            "mode === 'digital' ? <GovServices /> : mode === 'quiz' ? <LawStudentQuiz /> : ...",
        ],
        line_explanations=[
            ("path='/'", "Landing marketing page."),
            ("path='/login'", "Sign in / sign up."),
            ("path='/app'", "Main product after login."),
            ("mode state", "Which tool is selected in Sidebar."),
            ("AnimatePresence / motion", "Fade/slide between tools and pages."),
            ("useLocation", "Current path — helps AnimatePresence key pages."),
        ],
        analogy="A TV with channels. Sidebar changes the channel (mode).",
        if_delete="No pages — blank app.",
        memory="Routes = map of rooms. mode = which toy you hold.",
        quiz=["Name three routes.", "Which component shows for mode quiz?", "Why clear messages when mode changes?"],
        interview=["Controlled navigation vs links.", "Lifting state up (mode in App)."],
    )

    d.file_chapter(
        path="frontend/src/App.tsx (state + auth effects)",
        purpose=["Holds React state and listens to Firebase auth changes."],
        where_used=["Whole app reads these via props."],
        when_runs=["useState init on mount; useEffect on auth/theme/role changes."],
        code_lines=[
            "const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');",
            "const [user, setUser] = useState({ name:'', role:'', roleSelected:false, ... });",
            "const [mode, setMode] = useState('chat');",
            "const [messages, setMessages] = useState([]);",
            "useEffect(() => auth.onAuthStateChanged(async (currentUser) => { ... }), []);",
        ],
        line_explanations=[
            ("useState", "React memory box. Changing it re-renders."),
            ("theme", "light or dark; synced to <html> class + localStorage."),
            ("user", "Profile fields + roleSelected flag."),
            ("mode", "chat | report | quiz | ipc-bns | digital."),
            ("messages", "Chat bubbles array [{sender, text}]."),
            ("onAuthStateChanged", "Firebase calls you when login/logout happens."),
            ("role persistence", "localStorage nyay_role_<uid> + session pending_role."),
            ("canAccessMode", "If role cannot use mode, reset to defaultModeForRole."),
        ],
        analogy="App is the school principal's office keeping every student file (state).",
        if_delete="No memory — UI cannot track login, chat, or theme.",
        memory="State = sticky notes on App's desk.",
        quiz=["What hook stores theme?", "Where is role saved?", "What happens if Police opens quiz?"],
        interview=["Explain useEffect dependency array.", "Why lift messages state to App?"],
    )

    d.file_chapter(
        path="frontend/src/App.tsx (Google login + chat send)",
        purpose=["Sign in with Google popup; send chat/FIR to backend APIs."],
        where_used=["Passed to AuthPage / ChatInterface as callbacks."],
        when_runs=["On button click (login) or when user sends a message."],
        code_lines=[
            "const result = await signInWithPopup(auth, provider);",
            "await setDoc(doc(db, 'users', uid), { ... }, { merge: true });",
            "const response = await fetch(`${API_BASE_URL}/stream-chat`, { method:'POST', ... });",
            "// read streaming body and append to messages",
        ],
        line_explanations=[
            ("signInWithPopup", "Opens Google window; returns user credentials."),
            ("setDoc users", "Save/merge profile in Firestore collection users."),
            ("fetch stream-chat", "Ask backend for streaming legal answer."),
            ("ReadableStream reader", "Read chunks as they arrive; update last AI message."),
            ("file-report-interview", "Different endpoint when mode === 'report'."),
            ("async/await", "Wait for network without freezing the UI thread awkwardly."),
        ],
        analogy="Login = school ID check. Streaming chat = teacher talking sentence by sentence while you write notes.",
        if_delete="No Google login / broken chat.",
        memory="fetch = send a letter and wait for reply.",
        quiz=["Which Firebase method opens Google?", "Which endpoint streams chat?", "Why streaming?"],
        interview=["How does SSE/streaming UX help?", "Firestore setDoc merge true meaning?"],
    )

    d.file_chapter(
        path="frontend/src/firebase.js",
        purpose=["Initialize Firebase app; export auth, Google provider, Firestore db."],
        where_used=["App.tsx and any file needing login/database."],
        when_runs=["When first imported (module load)."],
        code_lines=[
            "import { initializeApp } from 'firebase/app';",
            "import { getAuth, GoogleAuthProvider } from 'firebase/auth';",
            "import { getFirestore } from 'firebase/firestore';",
            "const app = initializeApp(firebaseConfig);",
            "export const auth = getAuth(app);",
            "export const provider = new GoogleAuthProvider();",
            "export const db = getFirestore(app);",
        ],
        line_explanations=[
            ("firebaseConfig", "Project IDs/keys telling which Firebase project to use."),
            ("initializeApp", "Connect your web app to Firebase."),
            ("getAuth", "Login manager object."),
            ("GoogleAuthProvider", "Strategy: sign in with Google."),
            ("getFirestore", "Cloud NoSQL database handle."),
            ("export", "Other files can import auth/db."),
        ],
        analogy="The membership office phone numbers and forms, kept in one drawer.",
        if_delete="Login and chat history explode with import errors.",
        memory="firebase.js = keys to the clubhouse.",
        quiz=["What does auth do?", "What is Firestore used for?", "Why export provider?"],
        interview=["Client-side Firebase keys vs secret server keys?", "What is an Auth provider?"],
        extra_paragraphs=[
            "<b>Teacher tip:</b> Prefer putting config values in environment variables for real production hygiene.",
        ],
    )

    d.file_chapter(
        path="frontend/src/config/api.js",
        purpose=["Single source of truth for backend base URL."],
        where_used=["App.tsx, useLegalAI, voice hooks, etc."],
        when_runs=["Module import time."],
        code_lines=[
            "const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';",
            "export default API_BASE_URL;",
        ],
        line_explanations=[
            ("import.meta.env.VITE_API_URL", "Vite injects env vars that start with VITE_."),
            ("|| fallback", "If env missing, talk to local FastAPI on port 8000."),
            ("export default", "Other files import this string."),
        ],
        analogy="The kitchen phone number written on the fridge.",
        if_delete="Every fetch URL must be hardcoded — messy and error-prone.",
        memory="One address to rule all API calls.",
        quiz=["Default local URL?", "Why VITE_ prefix?", "Who imports this?"],
        interview=["How do you configure different API URLs for prod vs local?"],
    )

    d.file_chapter(
        path="frontend/src/config/roleAccess.js",
        purpose=["Role menus, icon map, normalizeRole, canAccessMode, defaultModeForRole."],
        where_used=["Sidebar (menus), App (access checks)."],
        when_runs=["Whenever menu is built or mode is validated."],
        code_lines=[
            "export const ROLE_MENUS = { Citizen:[...], Police:[...], Student:[...], Other:[...] };",
            "export const normalizeRole = (role) => { ... aliases ... };",
            "export const getMenuForRole = (role) => items.map(... React.createElement(Icon) ...);",
            "export const canAccessMode = (role, modeId) => items.some(...);",
        ],
        line_explanations=[
            ("ROLE_MENUS", "Dictionary: role name → list of tools."),
            ("id: 'report'", "FIR tool id used as mode."),
            ("id: 'quiz'", "Student quiz tool."),
            ("normalizeRole", "Make 'law student' become 'Student'."),
            ("ICONS map", "String name → lucide icon component."),
            ("React.createElement", "Build icon element without JSX in .js file (Vercel-safe)."),
            ("canAccessMode", "Boolean gate for security/UX."),
            ("defaultModeForRole", "First menu item id."),
        ],
        analogy="School timetable per class. Police class has FIR period; Student class has Quiz period.",
        if_delete="Sidebar breaks; everyone might see wrong tools.",
        memory="Roles = backpacks with different tools.",
        quiz=["Which role gets FIR?", "Why createElement instead of JSX here?", "What does normalizeRole fix?"],
        interview=["How do you implement RBAC on the frontend?", "Why also need backend authorization in real systems?"],
    )

    d.h1("Volume 1 folder flow diagram")
    d.ascii(
        """
Browser
  │
  ▼
index.html  ──theme script──► <html class="dark|light">
  │
  ▼
main.tsx ──css──► index.css
  │
  ▼
App.tsx
  │
  ├─ firebase.js (auth/db)
  ├─ config/api.js (backend URL)
  ├─ config/roleAccess.js (menus)
  └─ Router
       ├─ HomePage
       ├─ AuthPage
       └─ /app (Protected)
"""
    )
    d.p("End of Volume 1. Next: Volume 2 explains every component and page like Lego bricks.")
    d.p("Homework: explain ProtectedRoute and ROLE_MENUS to a friend without looking.")
    path = d.build()
    print("WROTE", path)
    return path


if __name__ == "__main__":
    vol1()
