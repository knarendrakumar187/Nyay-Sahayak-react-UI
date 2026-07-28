import React, { useState } from "react";
import { auth, provider } from "../firebase"; // Apni firebase file import kar
import { signInWithPopup } from "firebase/auth";

function Login() {
  const [user, setUser] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // Login successful hone ke baad user ki details yaha aayengi
      const userDetails = result.user;
      console.log("User Logged In:", userDetails);
      setUser(userDetails);
      
      // Yaha tu user ko redirect kar sakta hai (e.g., dashboard pe)
      // window.location.href = "/dashboard"; 
      
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {user ? (
        // Agar user login hai toh yeh dikhega
        <div>
          <h2>Welcome, {user.displayName}!</h2>
          <img src={user.photoURL} alt="Profile" style={{ borderRadius: "50%" }} />
          <p>Email: {user.email}</p>
        </div>
      ) : (
        // Agar login nahi hai toh button dikhega
        <button 
          onClick={handleGoogleLogin} 
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default Login;