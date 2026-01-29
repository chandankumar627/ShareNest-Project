"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc,
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  DollarSign,
  User,
  MapPin
} from "lucide-react";

export default function BookingsPage() {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("sent"); // sent or received
  const [loading, setLoading] = useState(true);
  const [negotiationModal, setNegotiationModal] = useState(null);
  const [counterOffer, setCounterOffer] = useState("");
  const [negotiationMessage, setNegotiationMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch sent requests (user as requester)
      const sentQuery = query(
        collection(db, "bookingRequests"),
        where("requesterId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const sentSnapshot = await getDocs(sentQuery);
      const sentData = sentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      // Fetch received requests (user as space owner)
      const receivedQuery = query(
        collection(db, "bookingRequests"),
        where("spaceOwnerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const receivedSnapshot = await getDocs(receivedQuery);
      const receivedData = receivedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      setBookingRequests(sentData);
      setReceivedRequests(receivedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status, counterPrice = null) => {
    try {
      const updateData = { 
        status,
        updatedAt: serverTimestamp()
      };
      
      if (counterPrice) {
        updateData.counterPrice = counterPrice;
      }

      await updateDoc(doc(db, "bookingRequests", bookingId), updateData);
      
      // Add negotiation message if provided
      if (negotiationMessage && status === "negotiating") {
        await addDoc(collection(db, "negotiations"), {
          bookingId,
          message: negotiationMessage,
          counterPrice: counterPrice,
          senderId: auth.currentUser.uid,
          createdAt: serverTimestamp()
        });
      }
      
      fetchBookings(); // Refresh data
      setNegotiationModal(null);
      setCounterOffer("");
      setNegotiationMessage("");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "accepted": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      case "negotiating": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <AlertCircle size={16} />;
      case "accepted": return <CheckCircle size={16} />;
      case "rejected": return <XCircle size={16} />;
      case "negotiating": return <MessageCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const BookingCard = ({ booking, isSent = true }) => (
    <div className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[6px_6px_20px_#c2c8d0,_-6px_-6px_20px_#ffffff] text-black">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{booking.spaceTitle}</h3>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <MapPin size={14} className="mr-1" />
            Space ID: {booking.spaceId}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span className="ml-1 capitalize">{booking.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 flex items-center">
            <User size={14} className="mr-2" />
            {isSent ? `Owner: ${booking.spaceOwnerEmail}` : `Requester: ${booking.requesterName}`}
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <Calendar size={14} className="mr-2" />
            {booking.bookingType === "daily" 
              ? `${booking.startDate} to ${booking.endDate}`
              : `${booking.startDate} for ${booking.hours} hours`
            }
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 flex items-center">
            <DollarSign size={14} className="mr-2" />
            Original: ₹{booking.originalPrice}
          </p>
          <p className="text-sm text-gray-600 flex items-center mt-1">
            <DollarSign size={14} className="mr-2" />
            Proposed: ₹{booking.proposedPrice}
          </p>
          {booking.counterPrice && (
            <p className="text-sm text-blue-600 flex items-center mt-1">
              <DollarSign size={14} className="mr-2" />
              Counter: ₹{booking.counterPrice}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Total Cost: ₹{booking.totalCost}</p>
        {booking.budget && (
          <p className="text-sm text-gray-600">Budget: ₹{booking.budget}</p>
        )}
      </div>

      {booking.message && (
        <div className="mb-4 p-3 rounded-xl bg-[#e0e5ec] shadow-inner">
          <p className="text-sm text-gray-700 flex items-start">
            <MessageCircle size={14} className="mr-2 mt-0.5" />
            {booking.message}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {formatDate(booking.createdAt)}
        </p>
        
        {!isSent && booking.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => updateBookingStatus(booking.id, "accepted")}
              className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setNegotiationModal(booking);
                setCounterOffer(booking.originalPrice);
              }}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
            >
              Negotiate
            </button>
            <button
              onClick={() => updateBookingStatus(booking.id, "rejected")}
              className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
            >
              Reject
            </button>
          </div>
        )}

        {isSent && booking.status === "negotiating" && (
          <div className="flex gap-2">
            <button
              onClick={() => updateBookingStatus(booking.id, "accepted")}
              className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
            >
              Accept Counter
            </button>
            <button
              onClick={() => {
                setNegotiationModal(booking);
                setCounterOffer(booking.proposedPrice);
              }}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
            >
              Counter Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20">
        <p className="text-center text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-black">
        My Bookings
      </h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#e0e5ec] p-2 rounded-2xl shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff]">
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-6 py-2 rounded-xl font-medium transition ${
              activeTab === "sent"
                ? "bg-[#d1d9e6] shadow-inner text-black"
                : "text-gray-600 hover:bg-[#d6dce4]"
            }`}
          >
            Sent Requests ({bookingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`px-6 py-2 rounded-xl font-medium transition ${
              activeTab === "received"
                ? "bg-[#d1d9e6] shadow-inner text-black"
                : "text-gray-600 hover:bg-[#d6dce4]"
            }`}
          >
            Received Requests ({receivedRequests.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === "sent" ? (
          bookingRequests.length === 0 ? (
            <p className="text-center text-gray-600">No booking requests sent yet.</p>
          ) : (
            <div className="space-y-6">
              {bookingRequests.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isSent={true} />
              ))}
            </div>
          )
        ) : (
          receivedRequests.length === 0 ? (
            <p className="text-center text-gray-600">No booking requests received yet.</p>
          ) : (
            <div className="space-y-6">
              {receivedRequests.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isSent={false} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Negotiation Modal */}
      {negotiationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#e0e5ec] rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff] w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-black mb-4">Make Counter Offer</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Counter Price (₹/{negotiationModal.bookingType === "daily" ? "day" : "hour"})
                </label>
                <input
                  type="number"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Message</label>
                <textarea
                  value={negotiationMessage}
                  onChange={(e) => setNegotiationMessage(e.target.value)}
                  rows="3"
                  placeholder="Explain your counter offer..."
                  className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none text-black"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setNegotiationModal(null)}
                  className="flex-1 py-2 rounded-xl bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateBookingStatus(negotiationModal.id, "negotiating", counterOffer)}
                  className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
                >
                  Send Counter Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}