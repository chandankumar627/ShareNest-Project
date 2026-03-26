"use client";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { MapPin, Image as ImageIcon, CheckCircle2, Loader2, X } from "lucide-react";

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // compress dimension limit
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 jpeg string (compressed)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

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
  const [loading, setLoading] = useState(false);
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

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    try {
      const base64Images = await Promise.all(selectedFiles.map(compressImage));
      setFiles((prev) => [...prev, ...base64Images]);
    } catch (err) {
      console.error("Error compressing images", err);
      alert("Error processing images.");
    }
  };

  const removeImage = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const user = auth.currentUser;
      await addDoc(collection(db, "spaces"), {
        ...formData,
        images: files, // save compressed base64 strings directly
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 font-sans mt-16 animate-slide-up-fade">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">
          List Your Space
        </h1>
        <p className="text-gray-500 mb-8">Share your extra space with students easily and securely.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="title" value={formData.title} onChange={handleChange} placeholder="Give your space a catchy title" label="Title" />
          <Input name="location" value={formData.location} onChange={handleChange} placeholder="Full Address or Area" label="Location" />
          
          {/* Price and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="0.00" 
                type="number" 
                label="Price (INR)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
              <select
                name="priceType"
                value={formData.priceType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="daily">Per Day</option>
                <option value="hourly">Per Hour</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input name="beds" value={formData.beds} onChange={handleChange} placeholder="e.g. 2" type="number" label="Number of Beds" />
            <Input name="contact" value={formData.contact} onChange={handleChange} type="number" placeholder="Phone Number" label="Contact Number" />
          </div>
          
          {/* Amenities */}
          <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["WiFi", "AC", "Kitchen", "Parking", "Laundry", "Balcony", "Furnished", "Security"].map((amenity) => (
                <label key={amenity} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                      } else {
                        setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the furnishing, rules, and availability in detail..." label="Description" />

          <div className="p-5 border border-dashed border-gray-300 hover:border-indigo-400 focus-within:border-indigo-500 rounded-2xl bg-gray-50 transition-colors text-center relative cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <ImageIcon className="text-gray-400 mb-2" size={32} />
              <p className="text-sm font-semibold text-gray-700">Click to upload images</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, up to 5MB</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {files.map((base64Str, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
                  <img src={base64Str} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-sm">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.latitude && formData.longitude && (
            <p className="text-sm font-medium text-emerald-600 flex items-center gap-2 bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100">
              <MapPin size={16} /> Location captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Publish Listing"}
          </button>
        </form>

        {showPopup && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl">
            <div className="flex flex-col items-center gap-4 animate-slide-up-fade">
              <CheckCircle2 size={64} className="text-emerald-500" />
              <h2 className="text-2xl font-bold text-gray-900">Space Listed!</h2>
              <p className="text-gray-500">Redirecting you to home...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Input({ name, value, onChange, placeholder, type = "text", label }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400"
      />
    </div>
  );
}

function Textarea({ name, value, onChange, placeholder, label }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        rows="4"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
      />
    </div>
  );
}
