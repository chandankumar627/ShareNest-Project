"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans px-6 animate-slide-up-fade">
      <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl text-center max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
        <h1 className="text-8xl font-black text-gray-900 mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page not found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">Oops! The page you are looking for doesn't exist or has been moved.</p>
        <Link
          href="/home"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-bold bg-gray-900 text-white shadow-md hover:bg-black hover:shadow-lg transition-all"
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
}
