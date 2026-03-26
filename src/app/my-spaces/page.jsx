"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { MapPin, Bed, Phone, Trash2, Edit3, ExternalLink, Loader2, Home } from "lucide-react";

export default function MySpacesPage() {
  const [mySpaces, setMySpaces] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMySpaces = async () => {
      const user = auth.currentUser;
      if (!user) {
        setMySpaces([]);
        setLoading(false);
        return;
      }

      setUserEmail(user.email);

      const q = query(
        collection(db, "spaces"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));

      setMySpaces(data);
      setLoading(false);
    };

    fetchMySpaces();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(date);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "spaces", selectedSpaceId));
      setMySpaces((prev) =>
        prev.filter((space) => space.id !== selectedSpaceId)
      );
      setShowModal(false);
      setSelectedSpaceId(null);
    } catch (error) {
      console.error("Error deleting space:", error);
      alert("Failed to delete the space.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 animate-slide-up-fade">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">
            My Listed Spaces
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your property listings for <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{userEmail}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading your properties...</p>
          </div>
        ) : mySpaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No spaces listed yet</h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              You haven't listed any properties. Start sharing your space to earn extra income!
            </p>
            <a href="/list-space" className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
              List a New Space
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mySpaces.map((space) => (
              <div
                key={space.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden relative"
              >
                {/* Images Layer */}
                <div className="h-48 bg-gray-100 relative">
                  {space.images?.length > 0 ? (
                    <img src={space.images[0]} alt={space.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Home size={32} className="opacity-50" />
                    </div>
                  )}
                  {/* Action Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSpaceId(space.id);
                        setShowModal(true);
                      }}
                      className="bg-white/90 backdrop-blur-sm text-red-600 p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-700 transition"
                      title="Delete Space"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{space.title}</h2>
                    <p className="text-sm text-gray-500 flex items-center mb-3 line-clamp-1">
                      <MapPin size={14} className="mr-1.5 opacity-70 shrink-0" />
                      {space.location}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      <span className="bg-gray-100 px-2.5 py-1 rounded-lg flex items-center">
                        <Bed size={14} className="mr-1.5 opacity-60" /> {space.beds} Beds
                      </span>
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">
                        ₹{space.price}/{space.priceType || "day"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {space.description}
                  </p>

                  <div className="pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Listed {formatDate(space.createdAt)}</span>
                    <span className="flex items-center">
                      <Phone size={14} className="mr-1 opacity-70" /> {space.contact}
                    </span>
                  </div>

                  {space.latitude && space.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${space.latitude},${space.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full text-center py-2.5 px-4 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm border border-gray-200 hover:bg-gray-100 transition flex justify-center items-center gap-2"
                    >
                      <ExternalLink size={16} /> View on Map
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-slide-up-fade">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Delete Listing?</h2>
              <p className="text-gray-500 mb-8 whitespace-pre-wrap">
                Are you sure you want to permanently delete this space? This action cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  className="w-full py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-sm transition"
                >
                  Yes, Delete Space
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
