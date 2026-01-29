"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { X, Calendar, Clock, MessageCircle, DollarSign, MapPin } from "lucide-react";

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

      console.log("Submitting booking request:", bookingRequest);
      
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
      alert(`Failed to submit booking request: ${error.message}. Please try again.`);
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">🏠 Book Space</h2>
              <p className="text-gray-600 mt-1">Reserve your perfect space</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-6 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <h3 className="font-bold text-xl text-gray-800 mb-2">{space.title}</h3>
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin size={16} className="mr-2 text-blue-500" />
              {space.location}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign size={16} className="mr-2 text-green-500" />
              Original Price: <span className="font-semibold ml-1">₹{space.price}/{space.priceType || "day"}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="inline mr-2 text-purple-500" size={16} />
                Booking Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    value="daily"
                    checked={bookingData.bookingType === "daily"}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">📅 Daily Booking</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="bookingType"
                    value="hourly"
                    checked={bookingData.bookingType === "hourly"}
                    onChange={handleChange}
                    className="mr-3 w-4 h-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-700">⏰ Hourly Booking</span>
                </label>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              {bookingData.bookingType === "daily" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="inline mr-2 text-green-500" size={16} />
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={bookingData.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="inline mr-2 text-yellow-500" size={16} />
                    Proposed Price (₹/{bookingData.bookingType === "daily" ? "day" : "hour"})
                  </label>
                  <input
                    type="number"
                    name="proposedPrice"
                    value={bookingData.proposedPrice}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Budget (₹)</label>
                  <input
                    type="number"
                    name="budget"
                    value={bookingData.budget}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MessageCircle className="inline mr-2 text-indigo-500" size={16} />
                Message to Owner
              </label>
              <textarea
                name="message"
                value={bookingData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Introduce yourself and explain your booking needs..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 text-lg">💰 Total Cost:</span>
                <span className="text-2xl font-bold text-green-600">₹{totalCost}</span>
              </div>
              {bookingData.budget && totalCost > bookingData.budget && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 flex items-center">
                    ⚠️ <span className="ml-2">Total cost exceeds your budget by ₹{totalCost - bookingData.budget}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-bold text-lg rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Request...
                </span>
              ) : (
                "🚀 Send Booking Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}