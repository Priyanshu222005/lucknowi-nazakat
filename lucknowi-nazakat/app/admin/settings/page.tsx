'use client';

import React, { useState } from 'react';
import { Save, Megaphone, LayoutTemplate } from 'lucide-react';

export default function AdminSettingsPage() {
  const [announcement, setAnnouncement] = useState('FREE SHIPPING ON ORDERS ABOVE ₹999');
  const [heroTitle, setHeroTitle] = useState('LUCKNOWI NAZAKAT');
  const [heroSubtitle, setHeroSubtitle] = useState('Elegance Woven in Tradition');
  const [heroDescription, setHeroDescription] = useState('Discover timeless Indian fashion crafted with grace.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Homepage CMS Settings</h1>
          <p className="text-sm text-gray-500">Manage hero banner text, announcement bar, and promotional content.</p>
        </div>
        {saved && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            ✓ Settings Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Announcement Bar Settings */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-800" /> Announcement Bar
          </h2>
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Banner Text</label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
            />
          </div>
        </div>

        {/* Hero Section Content */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-stone-800 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-800" /> Hero Section Content
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Main Heading</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Tagline Subtitle</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">Short Description</label>
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-amber-800 outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#6B1D2F] hover:bg-[#521624] text-[#F3E5AB] font-bold text-sm uppercase rounded-lg shadow transition-colors"
        >
          <Save className="w-4 h-4" /> Save Homepage Settings
        </button>
      </form>
    </div>
  );
}