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
  MapPin,
  ChevronRight,
  Send
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
      case "pending": return "text-amber-600 bg-amber-50 border-amber-200";
      case "accepted": return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "rejected": return "text-red-700 bg-red-50 border-red-200";
      case "negotiating": return "text-indigo-700 bg-indigo-50 border-indigo-200";
      default: return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock size={16} className="text-amber-500" />;
      case "accepted": return <CheckCircle size={16} className="text-emerald-500" />;
      case "rejected": return <XCircle size={16} className="text-red-500" />;
      case "negotiating": return <MessageCircle size={16} className="text-indigo-500" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const BookingCard = ({ booking, isSent = true }) => (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.spaceTitle}</h3>
          <p className="text-sm text-gray-500 flex items-center font-medium">
            <MapPin size={14} className="mr-1.5 opacity-70" />
            Space ID: <span className="font-mono text-xs ml-1 bg-gray-100 px-1.5 py-0.5 rounded">{booking.spaceId?.substring(0,8)}...</span>
          </p>
        </div>
        <div className={`px-4 py-2 flex items-center gap-2 rounded-full text-sm font-bold border ${getStatusColor(booking.status)}`}>
          {getStatusIcon(booking.status)}
          <span className="capitalize">{booking.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0 mt-0.5">
              <User size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                {isSent ? "Owner Contact" : "Requester Details"}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {isSent ? booking.spaceOwnerEmail : booking.requesterName}
              </p>
              {!isSent && <p className="text-sm text-gray-600">{booking.requesterEmail}</p>}
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 shrink-0 mt-0.5">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                Booking Duration ({booking.bookingType})
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {booking.bookingType === "daily" 
                  ? `${booking.startDate}  to  ${booking.endDate}`
                  : `${booking.startDate} • ${booking.startTime} (${booking.hours} hrs)`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Price Breakdown</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Original Price:</span>
              <span className="font-semibold text-gray-900">₹{booking.originalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Proposed Price:</span>
              <span className="font-bold text-indigo-600">₹{booking.proposedPrice}</span>
            </div>
            {booking.counterPrice && (
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                <span className="text-amber-600 font-medium tracking-tight">Counter Offer ⚡:</span>
                <span className="font-bold text-amber-600">₹{booking.counterPrice}</span>
              </div>
            )}
          </div>
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Total Estimate:</span>
            <span className="text-xl font-black text-gray-900 tracking-tight">₹{booking.totalCost}</span>
          </div>
          {booking.budget && (
            <div className="mt-2 text-right">
              <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">Budget limit: ₹{booking.budget}</span>
            </div>
          )}
        </div>
      </div>

      {booking.message && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-2 flex items-center gap-2">
            <MessageCircle size={14} /> Accompanying Message
          </p>
          <p className="text-sm text-gray-700 italic leading-relaxed">"{booking.message}"</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-400 font-medium">
          Requested on {formatDate(booking.createdAt)}
        </p>
        
        {!isSent && booking.status === "pending" && (
          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={() => updateBookingStatus(booking.id, "accepted")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-sm hover:bg-emerald-700 transition"
            >
              Accept
            </button>
            <button
              onClick={() => {
                setNegotiationModal(booking);
                setCounterOffer(booking.originalPrice);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-600 text-sm font-bold shadow-sm hover:bg-indigo-50 transition"
            >
              Negotiate
            </button>
            <button
              onClick={() => updateBookingStatus(booking.id, "rejected")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-bold hover:bg-red-100 transition"
            >
              Reject
            </button>
          </div>
        )}

        {isSent && booking.status === "negotiating" && (
          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={() => updateBookingStatus(booking.id, "accepted")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-sm hover:bg-emerald-700 transition"
            >
              Accept Offer
            </button>
            <button
              onClick={() => {
                setNegotiationModal(booking);
                setCounterOffer(booking.proposedPrice);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold shadow-sm hover:bg-black transition flex items-center justify-center gap-2"
            >
              Counter <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 animate-slide-up-fade">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">
            Manage Bookings
          </h1>
          <p className="text-gray-500">View and respond to booking requests</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none ${
                activeTab === "sent"
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Sent Requests <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">{bookingRequests.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("received")}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none ${
                activeTab === "received"
                  ? "bg-gray-900 text-white shadow"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Received <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-xs">{receivedRequests.length}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div>
            {activeTab === "sent" ? (
              bookingRequests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-bold text-gray-900 mb-1">No requests sent</p>
                  <p className="text-gray-500">You haven't requested any spaces yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookingRequests.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isSent={true} />
                  ))}
                </div>
              )
            ) : (
              receivedRequests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-bold text-gray-900 mb-1">No requests received</p>
                  <p className="text-gray-500">When users book your spaces, they will appear here.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {receivedRequests.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} isSent={false} />
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* Negotiation Modal */}
        {negotiationModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-slide-up-fade">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 relative">
              <button
                onClick={() => setNegotiationModal(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full transition"
              >
                <XCircle size={20} />
              </button>
              
              <h3 className="text-2xl font-black text-gray-900 mb-2">Counter Offer</h3>
              <p className="text-gray-500 mb-6 text-sm">Propose a new price for {negotiationModal.spaceTitle}</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Price (₹/{negotiationModal.bookingType === "daily" ? "day" : "hour"})
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={counterOffer}
                      onChange={(e) => setCounterOffer(e.target.value)}
                      min="0"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 font-bold transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Accompanying Message</label>
                  <textarea
                    value={negotiationMessage}
                    onChange={(e) => setNegotiationMessage(e.target.value)}
                    rows="3"
                    placeholder="Briefly explain your proposal..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 transition-all resize-none"
                  />
                </div>
                
                <button
                  onClick={() => updateBookingStatus(negotiationModal.id, "negotiating", counterOffer)}
                  className="w-full mt-2 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Proposal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}