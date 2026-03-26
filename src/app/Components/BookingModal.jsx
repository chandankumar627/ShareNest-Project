"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { X, Calendar, Clock, MessageCircle, DollarSign, MapPin, Loader2 } from "lucide-react";

export default function BookingModal({ space, isOpen, onClose }) {
  const [bookingData, setBookingData] = useState({
    bookingType: "daily",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    hours: 1,
    proposedPrice: space?.price || 0,
    message: "",
    budget: ""
  });
  
  const [userProfile, setUserProfile] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const profileDoc = await getDoc(doc(db, "profile", user.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
      }
    };
    
    if (isOpen) {
      fetchUserProfile();
      setBookingData(prev => ({
        ...prev,
        proposedPrice: space?.price || 0
      }));
    }
  }, [isOpen, space]);

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
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to make a booking");
        setLoading(false);
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
      onClose();
      
      setBookingData({
        bookingType: "daily",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        hours: 1,
        proposedPrice: space?.price || 0,
        message: "",
        budget: ""
      });
      
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

  if (!isOpen || !space) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm animate-slide-up-fade">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 relative">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Book Space</h2>
              <p className="text-gray-500 mt-1">Configure your reservation for this space</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

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
                <><Loader2 className="animate-spin" size={20} /> Sending...</>
              ) : (
                "Send Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}