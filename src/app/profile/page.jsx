"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    aadhar: "",
    profile: "",
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "profile", currentUser.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setFormData({ ...data, email: currentUser.email });
        } else {
          setFormData((prev) => ({ ...prev, email: currentUser.email }));
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
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    await setDoc(doc(db, "profile", user.uid), {
      ...formData,
      createdAt: serverTimestamp(),
      userId: user.uid,
    });

    setProfile(formData);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20 text-black">
      <div className="max-w-xl mx-auto bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff]">
        <h1 className="text-3xl font-extrabold mb-4 text-center">Your Profile</h1>

        {profile ? (
          <div className="space-y-3 text-lg">
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-inner">
                <img
                  src={profile.profile || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>Address:</strong> {profile.address}</p>
            <p><strong>Aadhar No:</strong> {profile.aadhar}</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">No profile found.</p>
        )}

        <div className="text-center mt-6">
          {user ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 rounded-xl font-bold bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,_-6px_-6px_10px_#ffffff] hover:bg-[#d6dce4]"
            >
              {profile ? "Edit Profile" : "Complete Profile"}
            </button>
          ) : (
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-2 rounded-xl font-bold bg-amber-700 text-white hover:bg-blue-700"
            >
              Login to Complete Profile
            </button>
          )}
        </div>
      </div>

      {showForm && user && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-[#e0e5ec] p-6 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff] w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Profile Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
              <Input name="email" value={formData.email} disabled />
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
              <Input name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="Aadhar Number" />
              <Input name="profile" value={formData.profile} onChange={handleChange} placeholder="Profile Image URL" />
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 font-bold rounded-xl bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,_-6px_-6px_10px_#ffffff] hover:bg-[#d6dce4]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ name, value, onChange, placeholder, disabled = false }) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={!disabled}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  );
}
