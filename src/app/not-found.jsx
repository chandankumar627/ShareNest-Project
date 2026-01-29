"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#e0e5ec] flex items-center justify-center font-sans">
      <div className="bg-[#e0e5ec] p-10 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff] text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-gray-700 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">Oops! Page not found.</p>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,_-6px_-6px_10px_#ffffff] hover:bg-[#d6dce4] transition text-black"
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
}
