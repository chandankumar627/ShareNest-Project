"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Star } from "lucide-react";
import BookingModal from "../Components/BookingModal";
import FilterPanel from "../Components/FilterPanel";

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
        space.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        space.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(space => 
        space.location.toLowerCase().includes(filters.location.toLowerCase())
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
      timeStyle: "short",
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

  return (
    <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-black">
            Available Spaces
          </h1>
          <p className="text-gray-600 mt-2">
            {filteredSpaces.length} of {spaces.length} spaces
            {filters.budget && ` • Budget: ₹${filters.budget}`}
          </p>
        </div>
      </div>

      <FilterPanel 
        filters={filters}
        onFiltersChange={setFilters}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
      />

      {filteredSpaces.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No spaces match your criteria.</p>
          <button
            onClick={() => setFilters({
              location: "",
              minPrice: "",
              maxPrice: "",
              minBeds: "",
              maxBeds: "",
              budget: "",
              searchTerm: ""
            })}
            className="mt-4 px-6 py-2 rounded-xl bg-[#e0e5ec] shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff] hover:bg-[#d6dce4] transition text-black"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredSpaces.map((space) => (
            <div
              key={space.id}
              className={`bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff] text-black flex flex-col lg:flex-row gap-6 relative ${
                isWithinBudget(space) ? 'ring-2 ring-green-400' : ''
              }`}
            >
              {/* Budget Badge */}
              {isWithinBudget(space) && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <Star size={12} className="mr-1" />
                  Within Budget
                </div>
              )}

              {/* LEFT SIDE - DETAILS */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{space.title}</h2>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <strong>Location:</strong> {space.location}
                  </p>

                  {space.latitude && space.longitude && (
                    <p className="text-sm text-gray-700">
                      🌐 <strong>Coordinates:</strong>{" "}
                      {space.latitude.toFixed(5)}, {space.longitude.toFixed(5)}
                    </p>
                  )}

                  <p className="text-sm text-gray-700">
                    💰 <strong>Price:</strong> ₹{space.price}/{space.priceType || "day"}
                  </p>
                  <p className="text-sm text-gray-700">
                    🛏️ <strong>Beds:</strong> {space.beds}
                  </p>
                  <p className="text-sm text-gray-700">
                    ✉️ <strong>Contact:</strong> {space.contact}
                  </p>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">
                  📝 <strong>Description:</strong> {space.description}
                </p>
                
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleBookSpace(space)}
                    className="flex-1 py-2 px-4 rounded-xl bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition flex items-center justify-center"
                  >
                    <Calendar className="mr-2" size={16} />
                    Book Now
                  </button>
                  <a
                    href={`tel:${space.contact}`}
                    className="px-4 py-2 rounded-xl bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
                  >
                    📞 Call
                  </a>
                </div>

                <p className="text-xs text-gray-500 text-right">
                  📅 Posted on: {formatDate(space.createdAt)}
                </p>

                {/* IMAGES */}
                {space.images?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {space.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Space ${idx}`}
                        className="w-24 h-24 object-cover rounded-xl cursor-pointer shadow hover:shadow-lg transition"
                        onClick={() => openPopup(space.images, idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE - MAP */}
              {space.latitude && space.longitude && (
                <div className="flex-1">
                  <iframe
                    src={`https://www.google.com/maps?q=${space.latitude},${space.longitude}&hl=en&z=15&output=embed`}
                    width="100%"
                    height="300"
                    className="rounded-xl shadow-inner"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POPUP SLIDER */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-3xl w-full px-6">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              <X size={24} />
            </button>

            {/* Image */}
            <img
              src={selectedImages[currentIndex]}
              alt="Space"
              className="w-full h-[70vh] object-contain rounded-xl shadow-lg"
            />

            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              <ChevronRight size={28} />
            </button>
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
  );
}
