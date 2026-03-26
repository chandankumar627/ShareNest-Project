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
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all hover:-translate-y-1 block md:hidden"
      >
        <Filter size={24} />
      </button>

      {/* Filter Panel */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-80 lg:w-96 bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col h-full bg-gray-50/50">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Filter className="mr-2 text-indigo-500" size={20} />
              Filters
            </h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-8">
            {/* Search Term */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Search className="mr-2 text-gray-400" size={16} /> Search
              </label>
              <input
                type="text"
                value={localFilters.searchTerm}
                onChange={(e) => handleChange("searchTerm", e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <MapPin className="mr-2 text-gray-400" size={16} /> Location
              </label>
              <input
                type="text"
                value={localFilters.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Enter city or area..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <DollarSign className="mr-2 text-gray-400" size={16} /> Price Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={localFilters.minPrice}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  placeholder="Min"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium"
                />
                <input
                  type="number"
                  value={localFilters.maxPrice}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  placeholder="Max"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between items-center">
                <span>Budget Limit</span>
                <span className="text-xs font-normal text-gray-400">Highlights matches</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={localFilters.budget}
                  onChange={(e) => handleChange("budget", e.target.value)}
                  placeholder="Enter your maximum budget..."
                  min="0"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* Number of Beds */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Bed className="mr-2 text-gray-400" size={16} /> Minimum Beds
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, "5+"].map((num) => {
                  const numStr = num.toString().replace('+','');
                  const isSelected = localFilters.minBeds === numStr;
                  return (
                    <button
                      key={num}
                      onClick={() => handleChange("minBeds", isSelected ? "" : numStr)}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                        isSelected 
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Quick Price Filters */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Under ₹500", min: "0", max: "500" },
                  { label: "₹500 - ₹1000", min: "500", max: "1000" },
                  { label: "Luxury (₹2000+)", min: "2000", max: "" }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      handleChange("minPrice", preset.min);
                      handleChange("maxPrice", preset.max);
                    }}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 bg-white">
            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-4 font-bold text-gray-700 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Clear Options
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop overlay for mobile when panel is open */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onToggle}
      />
    </>
  );
}