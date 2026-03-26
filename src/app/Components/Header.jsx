"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "My Posted Spaces", path: "/my-spaces" },
  { name: "My Bookings", path: "/bookings" },
  { name: "About", path: "/about" },
  { name: "Profile", path: "/profile" }
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-gray-900 hover:opacity-80 transition-opacity"
        >
          ShareNest<span className="text-indigo-600">.</span>
        </Link>

        <nav className="hidden md:flex gap-1 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-sm font-medium text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="ml-4 text-sm font-semibold px-5 py-2 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="ml-4 text-sm font-semibold px-5 py-2 rounded-full text-white bg-gray-900 hover:bg-black transition-colors shadow-sm"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-1 shadow-lg animate-slide-up-fade">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 pb-2 px-4 border-t border-gray-100 mt-2">
            {user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-center text-sm font-semibold px-4 py-3 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-semibold px-4 py-3 rounded-xl text-white bg-gray-900 hover:bg-black transition-colors shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
