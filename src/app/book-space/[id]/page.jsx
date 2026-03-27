"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { X, Calendar, Clock, MessageCircle, DollarSign, MapPin, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

export default function BookSpacePage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params?.id;
  
  const [space, setSpace] = useState(null);
  const [loadingSpace, setLoadingSpace] = useState(true);
  
  const [bookingData, setBookingData] = useState({
    bookingType: "daily",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    hours: 1,
    proposedPrice: 0,
    message: "",
    budget: ""
  });
  
  const [userProfile, setUserProfile] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, "profile", currentUser.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSpace = async () => {
      if (!spaceId) return;
      try {
        const docRef = doc(db, "spaces", spaceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const spaceData = { id: docSnap.id, ...docSnap.data() };
          setSpace(spaceData);
          setBookingData(prev => ({
            ...prev,
            proposedPrice: spaceData.price || 0
          }));
        } else {
          router.push("/find-space");
        }
      } catch (err) {
        console.error("Error fetching space:", err);
      } finally {
        setLoadingSpace(false);
      }
    };
    fetchSpace();
  }, [spaceId, router]);

  useEffect(() => {
    calculateTotalCost();
  }, [bookingData]);

  const calculateTotalCost = () => {
    const { bookingType, startDate, endDate, hours, proposedPrice } = bookingData;
    
    if (!proposedPrice || proposedPrice <= 0) {
      setTotalCost(0);
      return;
    }

    if (bookingType === "hourly") {
      const totalHours = parseInt(hours) || 1;
      setTotalCost(totalHours * parseFloat(proposedPrice));
    } else if (bookingType === "daily" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1);
      setTotalCost(days * parseFloat(proposedPrice));
    } else if (bookingType === "daily" && startDate) {
      setTotalCost(parseFloat(proposedPrice));
    } else {
      setTotalCost(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        alert("Please login to make a booking");
        router.push("/auth");
        return;
      }

      if (bookingData.bookingType === "daily" && (!bookingData.startDate || !bookingData.endDate)) {
        alert("Please select start and end dates for daily booking");
        setLoading(false);
        return;
      }

      if (bookingData.bookingType === "hourly" && (!bookingData.startDate || !bookingData.startTime || !bookingData.hours)) {
        alert("Please select date, start time, and hours for hourly booking");
        setLoading(false);
        return;
      }

      if (!bookingData.proposedPrice || bookingData.proposedPrice <= 0) {
        alert("Please enter a valid proposed price");
        setLoading(false);
        return;
      }

      const bookingRequest = {
        spaceId: space.id,
        spaceTitle: space.title || "Untitled Space",
        spaceOwnerId: space.userId,
        spaceOwnerEmail: space.userEmail || space.email,
        requesterId: user.uid,
        requesterEmail: user.email,
        requesterName: userProfile?.name || user.displayName || "Unknown User",
        requesterPhone: userProfile?.phone || "",
        bookingType: bookingData.bookingType,
        startDate: bookingData.startDate,
        endDate: bookingData.bookingType === "daily" ? bookingData.endDate : bookingData.startDate,
        startTime: bookingData.startTime || "",
        endTime: bookingData.endTime || "",
        hours: parseInt(bookingData.hours) || 1,
        originalPrice: parseFloat(space.price) || 0,
        proposedPrice: parseFloat(bookingData.proposedPrice) || 0,
        totalCost: totalCost || 0,
        message: bookingData.message || "",
        budget: bookingData.budget ? parseFloat(bookingData.budget) : null,
        status: "pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "bookingRequests"), bookingRequest);
      
      alert("🎉 Booking request sent successfully! The space owner will be notified.");
      router.push("/bookings");
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(`Failed to submit: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loadingSpace) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!space) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="max-w-3xl mx-auto animate-slide-up-fade">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to Spaces
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-gray-100 bg-white">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Book Space</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Configure your reservation for this space</p>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            <div className="mb-8 p-5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{space.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-1.5 opacity-70" />
                  {space.location}
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-0.5">Original Price</span>
                <div className="text-lg font-bold text-indigo-600">₹{space.price}<span className="text-sm font-medium text-gray-500">/{space.priceType || "day"}</span></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${bookingData.bookingType === 'daily' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="bookingType"
                      value="daily"
                      checked={bookingData.bookingType === "daily"}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">Daily Booking</span>
                      <span className="text-xs text-gray-500">Book per day</span>
                    </div>
                  </label>
                  <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${bookingData.bookingType === 'hourly' ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="bookingType"
                      value="hourly"
                      checked={bookingData.bookingType === "hourly"}
                      onChange={handleChange}
                      className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-600"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">Hourly Booking</span>
                      <span className="text-xs text-gray-500">Book per hour</span>
                    </div>
                  </label>
                </div>

                {bookingData.bookingType === "daily" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={bookingData.endDate}
                        onChange={handleChange}
                        required
                        min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={bookingData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Hours</label>
                      <input
                        type="number"
                        name="hours"
                        value={bookingData.hours}
                        onChange={handleChange}
                        min="1"
                        max="24"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Proposed Price (₹/{bookingData.bookingType === "daily" ? "day" : "hour"})
                    </label>
                    <input
                      type="number"
                      name="proposedPrice"
                      value={bookingData.proposedPrice}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
                      Your Budget (₹) <span className="font-normal text-gray-400 text-xs">Optional</span>
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={bookingData.budget}
                      onChange={handleChange}
                      placeholder="E.g. 5000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message to Owner</label>
                  <textarea
                    name="message"
                    value={bookingData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Introduce yourself and explain your booking needs..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 resize-none"
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 mt-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-gray-800 text-lg">Total Cost</span>
                  <span className="text-3xl font-black text-indigo-700 tracking-tight">₹{totalCost}</span>
                </div>
                {bookingData.budget && totalCost > bookingData.budget && (
                  <div className="text-sm font-medium text-red-600 mt-2 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2"></span>
                    Cost exceeds budget by ₹{totalCost - bookingData.budget}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-bold text-lg rounded-xl bg-gray-900 text-white shadow-md hover:bg-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Sending Request...</>
                ) : (
                  "Send Request"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
