"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Bell, Heart } from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "My Posted Spaces", path: "/my-spaces" },
  { name: "My Bookings", path: "/bookings" },
  { name: "Saved Spaces", path: "/saved" },
  { name: "About", path: "/about" },
  { name: "Profile", path: "/profile" }
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifCounts, setNotifCounts] = useState({ incoming: 0, negotiating: 0, accepted: 0 });
  const router = useRouter();

  useEffect(() => {
    let unsubs = [];

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      unsubs.forEach(unsub => unsub());
      unsubs = [];

      if (currentUser) {
        // Listener 1: Actionable incoming requests (Host)
        const q1 = query(collection(db, "bookingRequests"), where("spaceOwnerId", "==", currentUser.uid), where("status", "==", "pending"));
        const unsub1 = onSnapshot(q1, (snap) => {
          setNotifCounts(prev => ({ ...prev, incoming: snap.size }));
        });
        unsubs.push(unsub1);

        // Listener 2: Actionable outgoing requests (Guest negotiating)
        const q2 = query(collection(db, "bookingRequests"), where("requesterId", "==", currentUser.uid), where("status", "==", "negotiating"));
        const unsub2 = onSnapshot(q2, (snap) => {
          setNotifCounts(prev => ({ ...prev, negotiating: snap.size }));
        });
        unsubs.push(unsub2);

        // Listener 3: Actionable outgoing requests (Guest accepted)
        const q3 = query(collection(db, "bookingRequests"), where("requesterId", "==", currentUser.uid), where("status", "==", "accepted"));
        const unsub3 = onSnapshot(q3, (snap) => {
          setNotifCounts(prev => ({ ...prev, accepted: snap.size }));
        });
        unsubs.push(unsub3);
      } else {
        setNotifCounts({ incoming: 0, negotiating: 0, accepted: 0 });
      }
    });

    return () => {
      unsubscribe();
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const totalNotifs = notifCounts.incoming + notifCounts.negotiating + notifCounts.accepted;
  const hasNotifications = totalNotifs > 0;

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

          {user && (
            <div className="flex items-center ml-2 space-x-1 border-l border-gray-200 pl-4">
              <Link href="/saved" className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors relative group" title="Saved Spaces">
                <Heart size={20} className="group-hover:fill-rose-50" />
              </Link>
              <Link href="/bookings" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors relative group" title="Notifications">
                <Bell size={20} className="group-hover:fill-indigo-50" />
                {hasNotifications && (
                  <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white shadow-sm"></span>
                  </span>
                )}
              </Link>
            </div>
          )}

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
