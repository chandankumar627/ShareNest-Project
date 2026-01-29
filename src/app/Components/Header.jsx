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
    <header className="fixed top-0 left-0 w-full z-50 bg-[#e0e5ec] shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff]">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-extrabold text-gray-700"
          style={{ textShadow: "2px 2px 5px #c2c8d0, -2px -2px 5px #ffffff" }}
        >
          ShareNest
        </Link>

        <nav className="hidden md:flex gap-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="text-gray-700 font-medium px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa] hover:bg-[#d6dce4] transition"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="ml-4 text-gray-700 font-medium px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa] hover:bg-[#f2a6a6] transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="ml-4 text-gray-700 font-medium px-4 py-2 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa] hover:bg-[#d6dce4] transition"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#e0e5ec] border-t border-gray-300 px-6 py-4 space-y-3 shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 font-medium px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa] hover:bg-[#d6dce4] transition"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left text-gray-700 font-medium px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa] hover:bg-[#7b3f3f] transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 font-medium px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-[inset_4px_4px_6px_#c8ccd1,_inset_-4px_-4px_6px_#f0f5fa] hover:bg-[#078541] transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
