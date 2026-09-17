'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#6B1D2F] text-[#FAF7F2] text-xs sm:text-sm py-2 px-4 flex justify-between items-center tracking-wider uppercase font-medium">
      <div className="flex-1 text-center">
        ✨ Free Shipping on Orders Above ₹999 | Cash on Delivery Available Across India ✨
      </div>
      <button 
        onClick={() => setVisible(false)} 
        className="text-white/80 hover:text-white transition-colors"
        aria-label="Close Announcement Bar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}