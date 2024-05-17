import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../fbconfig";
import { doc, setDoc, getDoc, updateDoc  } from 'firebase/firestore';
import "./Button.css"; // Import button styles
import { Navigate, useNavigate } from "react-router-dom";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // State to track user authentication

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("Input field empty");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Capture device and browser information
        const deviceInfo = {
          userAgent: navigator.userAgent,
          deviceType: getDeviceType(),
          browser: getBrowser(),
        };

        // Get user document reference
        const userDocRef = doc(db, "users", user.uid);

        // Check if user document exists in Firestore
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          // Update user information with new device and browser information
          await updateDoc(userDocRef, {
            deviceInfo: deviceInfo,
          });
        } else {
          console.log("User document does not exist in Firestore");
        }

        console.log("Login with:", user);
        setUser(user); // Set the authenticated user
        onClose(); // Close the modal after successful login
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", errorCode, errorMessage);
      });
  };

  const history = useNavigate();

  const handleReset = () => {
    history("/reset");
  };

  // Redirect if user is authenticated
  if (user) {
    return <Navigate to="/home" />;
  }

  // Function to get device type
  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    return /Mobile/.test(userAgent) ? "Mobile" : "Desktop";
  };

  // Function to get browser
  const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (/Edg\//.test(userAgent)) return "Microsoft Edge";
    if (/Chrome\//.test(userAgent)) return "Google Chrome";
    if (/Firefox\//.test(userAgent)) return "Mozilla Firefox";
    if (/Safari\//.test(userAgent)) return "Apple Safari";
    if (/OPR\//.test(userAgent)) return "Opera";
    return "Unknown Browser";
  };

  return (
    <div className="modal flex items-center justify-center" style={{ zIndex: 100 }}>
      <div className="modal-content bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: "white" }}>Login</h2>
        <form id="login" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="block w-full px-4 py-2 mt-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="block w-full px-4 py-2 mt-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
          />
          <br />
          <p onClick={handleReset}>Forgot Password?</p>
          <button
            type="submit"
            className="btn btn--primary block w-full py-2 mt-4 rounded-md focus:outline-none"
          ></button>
          <button
            type="submit"
            className="btn btn--primary block w-full py-2 mt-4 rounded-md focus:outline-none"
          >
            Login
          </button>
        </form>
        <button
          onClick={onClose}
          className="btn btn--primary block w-full py-2 mt-4 rounded-md focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;

