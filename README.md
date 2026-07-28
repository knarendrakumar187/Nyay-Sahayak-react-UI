# Nyay Sahayak - AI Legal Assistant for Indians

> **Your Personal Legal Aid Companion** - Get instant legal guidance, file complaints, and access government services in your preferred language.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Web-orange)

## Live Demo

- **Frontend**: [https://nyay-sahayak-gray.vercel.app](https://nyay-sahayak-gray.vercel.app)
- **Backend API**: [https://nyay-sahayak-api-production.up.railway.app](https://nyay-sahayak-api-production.up.railway.app/docs)

## Features

- **AI Legal Assistant** - Get instant legal advice powered by Groq (Llama 3.3)
- **Voice Assistant** - Speak in Hindi/English/Hinglish, get responses in the same language
- **Document Generation** - Generate legal notices, rent agreements, and more
- **Google Authentication** - Secure login with Firebase
- **Chat History** - Your conversations saved securely
- **Multi-language Support** - Hindi, English, Hinglish, and regional languages
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS
- Firebase (Auth and Firestore)
- Deployed on **Vercel**

### Backend
- FastAPI (Python)
- Groq AI (Llama 3.3 70B)
- ChromaDB (Vector Database)
- Deployed on **Railway**

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- Python 3.10+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/TechJitu/Nyay-Sahayak-react-UI
cd Nyay-Sahayak-react-UI
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your GROQ API key (REQUIRED!)
# Windows:
set GROQ_API_KEY=your_groq_api_key_here

# Linux/Mac:
export GROQ_API_KEY=your_groq_api_key_here

# Start the server
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

**Get your free GROQ API key at: https://console.groq.com/**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Backend - Railway (Free)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project** > **Deploy from GitHub repo**
3. Select this repository
4. In Settings, set **Root Directory** to `/` (leave empty)
5. Add Environment Variable:
   - `GROQ_API_KEY` = your_groq_api_key
6. Deploy! Copy your Railway URL.

### Frontend - Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** > **Project** > Select this repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-railway-url.up.railway.app`
5. Deploy!

### Firebase Setup

Add your Vercel domain to Firebase authorized domains:
1. Go to Firebase Console > Authentication > Settings
2. Add your Vercel URL to **Authorized domains**

## Project Structure

```
Nyay-Sahayak-react-UI/
├── backend/
│   ├── api.py              # FastAPI backend
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker config for Railway
│   └── nyay_memory/        # ChromaDB storage
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── config/         # API configuration
│   │   ├── firebase.js     # Firebase config
│   │   └── App.tsx         # Main app
│   ├── vercel.json         # Vercel routing config
│   └── package.json
│
├── Dockerfile              # Main Docker config
├── railway.json            # Railway config
└── README.md
```

## Environment Variables

### Backend (Railway)
| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key | Yes |

### Frontend (Vercel)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Railway backend URL | Yes |

## Voice Assistant Usage

1. Click the **microphone button** on the chat interface
2. Speak your legal question in any language (Hindi/English/Hinglish)
3. AI responds in the **same language** you spoke
4. Click the speaker icon to hear the response

## Security Notes

- Never commit API keys to version control
- GROQ API key is loaded from environment variables
- Firebase API keys are safe to expose (restricted by domain rules)
- All user data is stored securely in Firebase

## Developers

- **[@zubershk](https://github.com/zubershk)** – Developer  
- **[@TechJitu](https://github.com/TechJitu)** – Developer

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Groq](https://groq.com/) - For blazing fast AI inference
- [Firebase](https://firebase.google.com/) - For authentication and database
- [Railway](https://railway.app/) - For backend hosting
- [Vercel](https://vercel.com/) - For frontend hosting

---

<p align="center">
  Made with love in India
</p>
