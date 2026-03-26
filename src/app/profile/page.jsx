"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Fingerprint, Camera, Edit2, ShieldCheck, Loader2, ArrowRight, X, QrCode } from "lucide-react";

export default function ProfilePage() {
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhar: "",
    profile: "",
    upiId: "",
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "profile", currentUser.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            const data = snap.data();
            setProfile(data);
            setFormData({ 
              name: "", email: currentUser.email, phone: "", address: "", aadhar: "", profile: "", upiId: "", 
              ...data 
            });
          } else {
            setFormData((prev) => ({ ...prev, email: currentUser.email }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setUser(null);
        setProfile(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          aadhar: "",
          profile: "",
          upiId: "",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "profile", user.uid), {
        ...formData,
        createdAt: profile?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
      });

      setProfile(formData);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium tracking-wide">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 animate-slide-up-fade">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative mb-8">
          <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20 mb-8">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white shrink-0">
                  <img
                    src={profile?.profile || "https://ui-avatars.com/api/?name=" + (profile?.name || user?.email || "User") + "&background=6366f1&color=fff&size=200"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {user && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  {profile?.name || "Anonymous User"}
                  {profile && <ShieldCheck className="inline-block ml-2 text-emerald-500 mb-1" />}
                </h1>
                <p className="text-gray-500 font-medium">{user?.email || "Not logged in"}</p>
              </div>

              {user ? (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-6 py-2.5 rounded-full font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  {profile ? "Edit Profile" : "Setup Profile"}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/auth")}
                  className="px-6 py-2.5 rounded-full font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition flex items-center justify-center gap-2"
                >
                  Login to setup <ArrowRight size={16} />
                </button>
              )}
            </div>

            {/* Profile Details Grid */}
            {profile ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <DetailItem icon={<User />} label="Full Name" value={profile.name} />
                <DetailItem icon={<Mail />} label="Email Address" value={profile.email} />
                <DetailItem icon={<Phone />} label="Phone Number" value={profile.phone || "Not provided"} />
                <DetailItem icon={<MapPin />} label="Residential Address" value={profile.address || "Not provided"} />
                <DetailItem icon={<Fingerprint />} label="Aadhar Number" value={profile.aadhar ? `•••• •••• ${profile.aadhar.slice(-4)}` : "Not provided"} />
              </div>
            ) : user ? (
              <div className="text-center py-10 bg-indigo-50/50 rounded-2xl border border-indigo-100 border-dashed">
                <User size={40} className="mx-auto text-indigo-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Your profile is incomplete</h3>
                <p className="text-gray-500 mb-4 text-sm max-w-sm mx-auto">Complete your profile to unlock all features, including booking and listing spaces securely.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 rounded-full font-bold bg-indigo-600 text-white shadow-sm hover:indigo-700 transition"
                >
                  Complete Now
                </button>
              </div>
            ) : null}
          </div>
        </div>

      </div>

      {/* Edit Profile Form Modal */}
      {showForm && user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-slide-up-fade">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900">{profile ? "Update Profile" : "Complete Profile"}</h2>
              <p className="text-gray-500 text-sm mt-1">Make sure your details map correctly to your identity.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input icon={<User size={18} />} name="name" value={formData.name} onChange={handleChange} placeholder="Full Legal Name" label="Full Name" />
              <Input icon={<Mail size={18} />} name="email" value={formData.email} disabled label="Email (Read-only)" />
              <Input icon={<Phone size={18} />} name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 9876543210" label="Phone Number" />
              <Input icon={<MapPin size={18} />} name="address" value={formData.address} onChange={handleChange} placeholder="Street, City, State" label="Address" />
              <Input icon={<Fingerprint size={18} />} name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="12 Digit Aadhar Number" label="Aadhar ID" />
              <Input icon={<QrCode size={18} />} name="upiId" value={formData.upiId} onChange={handleChange} placeholder="e.g. yourname@okbank" label="UPI ID (For Payments)" />
              <Input icon={<Camera size={18} />} name="profile" value={formData.profile} onChange={handleChange} placeholder="https://example.com/photo.jpg" label="Profile Photo URL" />
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-md hover:bg-indigo-700 transition disabled:opacity-70"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2.5 bg-white rounded-xl text-indigo-500 shadow-sm border border-gray-100 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Input({ icon, name, value, onChange, placeholder, disabled = false, label }) {
  return (
    <div>
      {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={!disabled}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-900 ${
            disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50 focus:bg-white'
          }`}
        />
      </div>
    </div>
  );
}
