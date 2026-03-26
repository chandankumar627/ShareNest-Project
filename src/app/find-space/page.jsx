"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, orderBy, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Star, Phone, ShieldCheck, Heart } from "lucide-react";
import BookingModal from "../Components/BookingModal";
import FilterPanel from "../Components/FilterPanel";
import ImageSlider from "../Components/ImageSlider";

export default function FindSpacePage() {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    minBeds: "",
    maxBeds: "",
    budget: "",
    searchTerm: ""
  });
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "favorites"), where("userId", "==", currentUser.uid));
        const snap = await getDocs(q);
        const favIds = snap.docs.map(doc => doc.data().spaceId);
        setFavorites(favIds);
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSpaces = async () => {
      const q = query(collection(db, "spaces"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => {
        const space = doc.data();
        return {
          id: doc.id,
          ...space,
          createdAt: space.createdAt?.toDate() || null,
        };
      });
      setSpaces(data);
      setFilteredSpaces(data);
    };

    fetchSpaces();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, spaces]);

  const applyFilters = () => {
    let filtered = [...spaces];

    // Search term filter
    if (filters.searchTerm) {
      filtered = filtered.filter(space => 
        space.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        space.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(space => 
        space.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(space => parseFloat(space.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(space => parseFloat(space.price) <= parseFloat(filters.maxPrice));
    }

    // Beds filter
    if (filters.minBeds) {
      filtered = filtered.filter(space => parseInt(space.beds) >= parseInt(filters.minBeds));
    }
    if (filters.maxBeds) {
      filtered = filtered.filter(space => parseInt(space.beds) <= parseInt(filters.maxBeds));
    }

    setFilteredSpaces(filtered);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(date);
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

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleBookSpace = (space) => {
    setSelectedSpace(space);
    setIsBookingModalOpen(true);
  };

  const isWithinBudget = (space) => {
    if (!filters.budget) return false;
    return parseFloat(space.price) <= parseFloat(filters.budget);
  };

  const toggleFavorite = async (spaceId) => {
    if (!user) {
      alert("Please login to save spaces!");
      return;
    }

    try {
      const isFav = favorites.includes(spaceId);
      if (isFav) {
        setFavorites(prev => prev.filter(id => id !== spaceId));
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid), where("spaceId", "==", spaceId));
        const snap = await getDocs(q);
        snap.forEach(async (d) => {
          await deleteDoc(doc(db, "favorites", d.id));
        });
      } else {
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

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 animate-slide-up-fade">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore Available Spaces
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Showing {filteredSpaces.length} of {spaces.length} spaces
              {filters.budget && <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-2">Budget: ₹{filters.budget}</span>}
            </p>
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            {isFilterOpen ? "Close Filters" : "Filter Spaces"}
          </button>
        </div>

        <FilterPanel 
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />

        {filteredSpaces.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm mt-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No spaces found</h3>
            <p className="text-gray-500 text-base mb-6">We couldn't find any spaces matching your criteria.</p>
            <button
              onClick={() => setFilters({
                location: "", minPrice: "", maxPrice: "", minBeds: "", maxBeds: "", budget: "", searchTerm: ""
              })}
              className="px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 mt-8">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                className={`bg-white rounded-3xl shadow-sm border ${
                  isWithinBudget(space) ? 'border-emerald-300 ring-4 ring-emerald-50' : 'border-gray-200 hover:shadow-lg transition-shadow'
                } flex flex-col lg:flex-row overflow-hidden relative group`}
              >
                {/* Budget Badge */}
                {isWithinBudget(space) && (
                  <div className="absolute top-4 left-4 z-20 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm pointer-events-none">
                    <Star size={14} className="mr-1 fill-current" />
                    Within Budget
                  </div>
                )}

                {/* LEFT SIDE - IMAGES */}
                <div className="lg:w-1/3 h-64 lg:h-auto bg-gray-100 relative group/slider">
                  <ImageSlider images={space.images || []} onExpand={(images, index) => openPopup(images, index)} />
                  
                  {/* Heart Button Overlay */}
                  <div className={`absolute z-20 ${isWithinBudget(space) ? 'top-14 left-4' : 'top-4 left-4'}`}>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(space.id); }}
                      className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all ${
                        favorites.includes(space.id) 
                          ? "bg-rose-50 text-rose-500 hover:bg-rose-100" 
                          : "bg-white/80 text-gray-400 hover:bg-white hover:text-rose-500 hover:scale-110"
                      }`}
                      title={favorites.includes(space.id) ? "Remove from Favorites" : "Save to Favorites"}
                    >
                      <Heart size={20} className={favorites.includes(space.id) ? "fill-rose-500" : ""} />
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE - DETAILS */}
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
                      <MapPin size={16} className="mr-1.5 text-gray-400" />
                      {space.location}
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

                    <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {space.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium w-full sm:w-auto">
                      <span className="bg-gray-100 px-3 py-1.5 rounded-full text-xs">Posted {formatDate(space.createdAt)}</span>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto">
                      <a
                        href={`tel:${space.contact}`}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <Phone size={18} />
                        Call
                      </a>
                      <button
                        onClick={() => handleBookSpace(space)}
                        className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <Calendar size={18} />
                        Book
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
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-3 rounded-full backdrop-blur-sm transition"
              >
                <X size={28} />
              </button>

              {/* Image */}
              <div className="relative w-full h-[70vh] flex items-center justify-center">
                <img
                  src={selectedImages[currentIndex]}
                  alt="Space"
                  className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                />
              </div>

              {/* Controls */}
              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-sm transition"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 p-4 rounded-full backdrop-blur-sm transition"
                  >
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
        <BookingModal 
          space={selectedSpace}
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedSpace(null);
          }}
        />
      </div>
    </div>
  );
}
