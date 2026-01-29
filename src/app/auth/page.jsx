"use client";

import { useEffect, useState } from "react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [useEmail, setUseEmail] = useState(true); // 👈 Directly show Email form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      signOut(auth)
        .then(() => console.log("User signed out on /auth"))
        .catch((err) => console.error("Error logging out:", err));
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/home");
    } catch (err) {
      alert("Google sign-in failed: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirm) {
      alert("Passwords do not match.");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0e5ec] font-sans">
      <div className="bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff] w-full max-w-md">
        
        {/* Always Email Login/Register */}
        <div className="flex justify-between mb-6">
          <button
            className={`flex-1 py-2 font-bold rounded-xl transition text-black ${
              isLogin ? "bg-[#d1d9e6] shadow-inner" : "hover:bg-[#d1d9e6]"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-bold rounded-xl transition text-black ${
              !isLogin ? "bg-[#d1d9e6] shadow-inner" : "hover:bg-[#d1d9e6]"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="flex flex-col" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mb-4 px-4 py-3 rounded-xl text-black bg-[#e0e5ec] shadow-inner"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-4 px-4 py-3 rounded-xl text-black bg-[#e0e5ec] shadow-inner"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 px-4 py-3 rounded-xl text-black bg-[#e0e5ec] shadow-inner"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="mb-4 px-4 py-3 rounded-xl text-black bg-[#e0e5ec] shadow-inner"
            />
          )}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,_-6px_-6px_10px_#ffffff] hover:bg-[#d6dce4] font-bold py-3 rounded-xl transition mb-4 text-black"
          >
            {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Optional Google Button */}
        <p className="text-center text-sm text-gray-600 mb-2">Or continue with</p>
        <div className="flex justify-around">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-10 h-10 rounded-full text-black bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,_-6px_-6px_10px_#ffffff] hover:bg-[#d6dce4]"
          >
            G
          </button>
        </div>
      </div>
    </div>
  );
}
