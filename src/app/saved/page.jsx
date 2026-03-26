"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Phone, ShieldCheck, Heart, BookmarkX, Loader2 } from "lucide-react";
import BookingModal from "../Components/BookingModal";
import ImageSlider from "../Components/ImageSlider";
import { useRouter } from "next/navigation";

export default function SavedSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Popup state
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Booking state
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        await fetchSavedSpaces(currentUser.uid);
      } else {
        setSpaces([]);
        setFavorites([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSavedSpaces = async (uid) => {
    try {
      // 1. Get favorite IDs
      const favQuery = query(collection(db, "favorites"), where("userId", "==", uid));
      const favSnap = await getDocs(favQuery);
      const favIds = favSnap.docs.map(doc => doc.data().spaceId);
      setFavorites(favIds);
      
      if (favIds.length === 0) {
         setSpaces([]);
         setLoading(false);
         return;
      }
      
      // 2. Fetch those specific spaces
      const spacesSnap = await getDocs(collection(db, "spaces"));
      const allSpaces = spacesSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() || null }));
      
      const savedSpaces = allSpaces.filter(space => favIds.includes(space.id));
      setSpaces(savedSpaces);
    } catch (err) {
      console.error("Error fetching saved spaces", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (spaceId) => {
    if (!user) return;
    try {
      const isFav = favorites.includes(spaceId);
      if (isFav) {
        setFavorites(prev => prev.filter(id => id !== spaceId));
        setSpaces(prev => prev.filter(space => space.id !== spaceId)); // remove from view instantly
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid), where("spaceId", "==", spaceId));
        const snap = await getDocs(q);
        snap.forEach(async (d) => {
          await deleteDoc(doc(db, "favorites", d.id));
        });
      } else {
        // Technically not possible from this page since they are already saved, but safe to include
        setFavorites(prev => [...prev, spaceId]);
        await setDoc(doc(collection(db, "favorites")), {
          userId: user.uid,
          spaceId: spaceId,
          createdAt: new Date()
        });
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
  };

  const openPopup = (images, index) => {
    setSelectedImages(images);
    setCurrentIndex(index);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedImages([]);
    setCurrentIndex(0);
  };

  const handleBookSpace = (space) => {
    setSelectedSpace(space);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 animate-slide-up-fade">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500" size={28} /> Saved Spaces
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Your personal wishlist of properties
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
            <p className="text-gray-500 font-medium">Loading your favorites...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm mt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 text-base mb-6">You must be logged in to view your saved spaces.</p>
            <button onClick={() => router.push("/auth")} className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition shadow-sm">
              Go to Login
            </button>
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm mt-8">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300">
              <BookmarkX size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No saved spaces yet</h3>
            <p className="text-gray-500 text-base mb-6">Spaces you favorite while browsing will appear here.</p>
            <button onClick={() => router.push("/find-space")} className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-sm">
              Explore Spaces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mt-8">
            {spaces.map((space) => (
              <div key={space.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow flex flex-col lg:flex-row overflow-hidden relative group">
                <div className="lg:w-1/3 h-64 lg:h-auto bg-gray-100 relative group/slider">
                  <ImageSlider images={space.images || []} onExpand={(images, index) => openPopup(images, index)} />
                  <div className="absolute top-4 left-4 z-20">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(space.id); }}
                      className="p-2.5 rounded-full shadow-md backdrop-blur-md transition-all bg-rose-50 text-rose-500 hover:bg-white hover:scale-110"
                      title="Remove from Favorites"
                    >
                      <Heart size={20} className="fill-rose-500" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                       <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">{space.title}</h2>
                       <div className="text-right ml-4 shrink-0">
                         <p className="text-2xl font-black text-indigo-600">₹{space.price}</p>
                         <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Per {space.priceType || "day"}</p>
                       </div>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center mb-6">
                      <MapPin size={16} className="mr-1.5 text-gray-400" /> {space.location}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col justify-center">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Beds</span>
                        <span className="text-lg font-bold text-gray-900">{space.beds}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex flex-col justify-center">
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Status</span>
                        <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                          <ShieldCheck size={16} /> Verified
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">{space.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium w-full sm:w-auto">
                      <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs">Posted {formatDate(space.createdAt)}</span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button onClick={() => handleBookSpace(space)} className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <Calendar size={18} /> Book Space
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* POPUP SLIDER */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-slide-up-fade">
            <div className="relative max-w-5xl w-full px-4 md:px-12 h-screen flex flex-col justify-center">
              <button onClick={closePopup} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-sm transition">
                <X size={28} />
              </button>
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                <img src={selectedImages[currentIndex]} alt="Space" className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg" />
              </div>
              {selectedImages.length > 1 && (
                <>
                  <button onClick={() => setCurrentIndex(p => p === 0 ? selectedImages.length - 1 : p - 1)} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-sm transition">
                    <ChevronLeft size={32} />
                  </button>
                  <button onClick={() => setCurrentIndex(p => p === selectedImages.length - 1 ? 0 : p + 1)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-sm transition">
                    <ChevronRight size={32} />
                  </button>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                    {currentIndex + 1} / {selectedImages.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Booking Modal */}
        <BookingModal space={selectedSpace} isOpen={isBookingModalOpen} onClose={() => { setIsBookingModalOpen(false); setSelectedSpace(null); }} />
      </div>
    </div>
  );
}
