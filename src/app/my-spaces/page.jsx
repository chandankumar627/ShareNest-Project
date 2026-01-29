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
      timeStyle: "short",
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
    <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20 relative">
      <h1 className="text-3xl font-extrabold mb-2 text-center text-black">
        My Listed Spaces
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Showing listings for: <strong>{userEmail}</strong>
      </p>

      {loading ? (
        <p className="text-center text-gray-600">Loading your spaces...</p>
      ) : mySpaces.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t listed any spaces yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mySpaces.map((space) => (
            <div
              key={space.id}
              className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff] text-black relative"
            >
              <button
                onClick={() => {
                  setSelectedSpaceId(space.id);
                  setShowModal(true);
                }}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 bg-[#e0e5ec] rounded-full px-3 py-1 text-xs font-bold shadow-[4px_4px_10px_#c2c8d0,_-4px_-4px_10px_#ffffff]"
              >
                🗑 Delete
              </button>

              <h2 className="text-xl font-bold mb-2">{space.title}</h2>
              <p className="text-sm text-gray-700 mb-1">
                📍 <strong>Location:</strong> {space.location}
              </p>

              {space.latitude && space.longitude && (
                <p className="text-sm text-gray-700 mb-1">
                  🌐 <strong>Coordinates:</strong>{" "}
                  {space.latitude.toFixed(5)}, {space.longitude.toFixed(5)}
                </p>
              )}

              <p className="text-sm text-gray-700 mb-1">
                💰 <strong>Price:</strong> ₹{space.price}/{space.priceType || "day"}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                🛏️ <strong>Beds:</strong> {space.beds}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                ✉️ <strong>Contact:</strong> {space.contact}
              </p>
              <p className="text-sm text-gray-700 mt-3">
                📝 <strong>Description:</strong> {space.description}
              </p>
              <p className="text-xs text-gray-500 mt-3 text-right">
                📅 Posted: {formatDate(space.createdAt)}
              </p>

              {space.latitude && space.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${space.latitude},${space.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block w-full text-center py-2 px-4 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
                >
                  🌍 View on Google Maps
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-[#e0e5ec] rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff] p-6 max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">
              Are you sure you want to delete this space?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-[#e0e5ec] text-black shadow-[4px_4px_10px_#c2c8d0,_-4px_-4px_10px_#ffffff] hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-500 text-white shadow hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
