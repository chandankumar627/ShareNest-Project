"use client";

import { useState } from "react";
import { Filter, X, MapPin, DollarSign, Bed, Search } from "lucide-react";

export default function FilterPanel({ filters, onFiltersChange, isOpen, onToggle }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: "",
      minPrice: "",
      maxPrice: "",
      minBeds: "",
      maxBeds: "",
      budget: "",
      searchTerm: ""
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-24 right-6 z-40 p-3 rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#c2c8d0,_-6px_-6px_12px_#ffffff] hover:bg-[#d6dce4] transition"
      >
        <Filter size={20} className="text-black" />
      </button>

      {/* Filter Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-l border-gray-200 transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Filter className="mr-2" size={20} />
              Filters
            </h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Term */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="inline mr-2 text-indigo-500" size={16} />
                Search
              </label>
              <input
                type="text"
                value={localFilters.searchTerm}
                onChange={(e) => handleChange("searchTerm", e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline mr-2 text-green-500" size={16} />
                Location
              </label>
              <input
                type="text"
                value={localFilters.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Enter city or area..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Price Range */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="inline mr-2 text-yellow-500" size={16} />
                Price Range (₹/day)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Budget */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Your Budget (₹)
              </label>
              <input
                type="number"
                value={localFilters.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                placeholder="Enter your total budget..."
                min="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-600 mt-1">
                Spaces within your budget will be highlighted
              </p>
            </div>

            {/* Number of Beds */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Bed className="inline mr-2 text-teal-500" size={16} />
                Number of Beds
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={localFilters.minBeds}
                  onChange={(e) => handleChange("minBeds", e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={localFilters.maxBeds}
                  onChange={(e) => handleChange("maxBeds", e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Quick Budget Filters */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl border border-rose-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Budget Filters</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Under ₹500", value: "500" },
                  { label: "₹500-1000", value: "1000" },
                  { label: "₹1000-2000", value: "2000" },
                  { label: "₹2000+", value: "2000+" }
                ].map((option) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      if (option.value === "2000+") {
                        handleChange("minPrice", "2000");
                        handleChange("maxPrice", "");
                      } else {
                        const prevValue = option.label === "Under ₹500" ? "0" : 
                                        option.label === "₹500-1000" ? "500" : "1000";
                        handleChange("minPrice", prevValue);
                        handleChange("maxPrice", option.value);
                      }
                    }}
                    className="px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-gray-700 font-medium shadow-sm hover:shadow-md"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:from-red-600 hover:to-pink-600 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop - Removed */}
    </>
  );
}