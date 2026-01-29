"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ListSpacePage() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    priceType: "daily", // daily or hourly
    description: "",
    beds: "",
    contact: "",
    latitude: "",
    longitude: "",
    images: [], // store image paths
    amenities: [],
    availability: "available" // available, booked, maintenance
  });

  const [files, setFiles] = useState([]); // for local selection
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Failed to get location:", error.message);
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagePaths = [];

      if (files.length > 0) {
        const formDataUpload = new FormData();
        files.forEach((file) => formDataUpload.append("images", file));

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const data = await res.json();
        if (res.ok) {
          imagePaths = data.paths;
        } else {
          alert("Image upload failed: " + data.error);
          return;
        }
      }

      const user = auth.currentUser;
      await addDoc(collection(db, "spaces"), {
        ...formData,
        images: imagePaths, // save uploaded image paths
        createdAt: serverTimestamp(),
        userId: user ? user.uid : null,
        userEmail: user ? user.email : null,
      });

      setFormData({
        title: "",
        location: "",
        price: "",
        priceType: "daily",
        description: "",
        beds: "",
        contact: "",
        latitude: "",
        longitude: "",
        images: [],
        amenities: [],
        availability: "available"
      });
      setFiles([]);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        router.push("/home");
      }, 2000);
    } catch (error) {
      alert("Failed to submit listing: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] px-6 py-12 font-sans mt-20">
      <div className="max-w-xl mx-auto bg-[#e0e5ec] p-8 rounded-2xl shadow-[10px_10px_30px_#c2c8d0,_-10px_-10px_30px_#ffffff]">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-black">
          List Your Space
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-black">
          <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
          <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
          
          {/* Price and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="Price (INR)" 
                type="number" 
              />
            </div>
            <div>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="daily">Per Day</option>
                <option value="hourly">Per Hour</option>
              </select>
            </div>
          </div>

          <Input name="beds" value={formData.beds} onChange={handleChange} placeholder="Number of Beds" type="number" />
          <Input name="contact" value={formData.contact} onChange={handleChange} type="number" placeholder="Contact Number" />
          
          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Amenities (select all that apply)</label>
            <div className="grid grid-cols-2 gap-2">
              {["WiFi", "AC", "Kitchen", "Parking", "Laundry", "Balcony", "Furnished", "Security"].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          amenities: [...prev.amenities, amenity]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          amenities: prev.amenities.filter(a => a !== amenity)
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (furnishing, rules, availability, etc.)" />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none"
          />

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {files.map((file, idx) => (
                <p key={idx} className="text-xs text-gray-700">{file.name}</p>
              ))}
            </div>
          )}

          {formData.latitude && formData.longitude && (
            <p className="text-sm text-gray-600">
              📍 Current Location: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-xl bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,_-6px_-6px_10px_#ffffff] hover:bg-[#d6dce4] transition"
          >
            Submit Listing
          </button>
        </form>

        {showPopup && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#e0e5ec] border border-gray-300 text-black font-semibold px-6 py-3 rounded-xl shadow-[6px_6px_15px_#c2c8d0,_-6px_-6px_15px_#ffffff] z-50 animate-fade-in-out">
            ✅ Space listed successfully!
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  );
}

function Textarea({ name, value, onChange, placeholder }) {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      rows="4"
      className="w-full px-4 py-3 rounded-xl bg-[#e0e5ec] shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
    />
  );
}
