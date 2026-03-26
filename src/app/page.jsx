"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      await signInWithPopup(auth, googleProvider);
      router.push("/home");
    } catch (err) {
      setErrorMsg("Google sign-in failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isLogin && password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/list-space");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white overflow-hidden">
      {/* Left Side: Visual / Brand */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-gray-900 items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(79,70,229,0.15),_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_rgba(124,58,237,0.15),_transparent_50%)]"></div>

        <div className="relative z-10 w-full max-w-lg text-white">
          <Link href="/home" className="inline-block text-3xl font-black tracking-tight mb-20 hover:opacity-80 transition-opacity">
            ShareNest<span className="text-indigo-500">.</span>
          </Link>



          <h1 className="text-5xl font-extrabold mb-8 leading-[1.1] tracking-tight">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">perfect spaces</span> everywhere.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-md">
            Whether you're looking for a short-term study spot or wanting to share your extra room, ShareNest connects you instantly.
          </p>

          {/* Trust badges */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-6 rounded-2xl">

          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 bg-gray-50 lg:bg-white relative">
        <Link href="/home" className="absolute top-8 left-8 lg:left-12 text-gray-500 hover:text-gray-900 transition flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        <div className="w-full max-w-md animate-slide-up-fade">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-gray-500 text-base">
              {isLogin
                ? "Enter your details to access your account."
                : "Sign up to start finding and sharing spaces."}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2 flex-shrink-0"></span>
              {errorMsg}
            </div>
          )}

          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            <button
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              onClick={() => { setIsLogin(true); setErrorMsg(""); }}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              onClick={() => { setIsLogin(false); setErrorMsg(""); }}
            >
              Sign Up
            </button>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex justify-between">
                Password
                {isLogin && <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold focus:outline-none">Forgot?</a>}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <><LogIn size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign In securely</>
              ) : (
                <><UserPlus size={18} className="group-hover:-translate-x-1 transition-transform" /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 lg:bg-white text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group font-semibold text-gray-700"
              >
                <FcGoogle size={24} className="group-hover:scale-110 transition-transform" />
                Continue with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

