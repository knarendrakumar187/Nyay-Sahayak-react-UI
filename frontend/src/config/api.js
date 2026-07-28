// API Configuration
// Change this URL when deploying to production

// For local development
// const API_BASE_URL = "http://127.0.0.1:8000";

// For Render deployment (update with your actual Render backend URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default API_BASE_URL;
