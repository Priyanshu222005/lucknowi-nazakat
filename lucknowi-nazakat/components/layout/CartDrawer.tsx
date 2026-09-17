'use client';

import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#2D2D2D] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#6B1D2F]/10 bg-[#FAF7F2]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#6B1D2F]" />
              <h2 className="font-serif text-lg font-bold text-[#6B1D2F]">Your Shopping Bag</h2>
            </div>
            <button 
              onClick={closeCart}
              className="p-1.5 text-gray-500 hover:text-[#6B1D2F] transition-colors rounded-full hover:bg-[#F4EBE1]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
                <p className="text-[#2D2D2D]/70 font-medium">Your bag is currently empty.</p>
                <button
                  onClick={closeCart}
                  className="inline-block px-6 py-2.5 text-xs uppercase tracking-widest bg-[#6B1D2F] text-white font-semibold rounded hover:bg-[#521624] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.id}-${item.size}`} 
                  className="flex gap-4 p-3 bg-white border border-[#6B1D2F]/10 rounded-lg shadow-sm"
                >
                  <div className="relative w-20 h-24 bg-[#F4EBE1] rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-[#2D2D2D] line-clamp-1">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Size: <span className="font-semibold text-[#6B1D2F]">{item.size}</span></p>
                      <p className="text-sm font-bold text-[#6B1D2F] mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex items-center space-x-2 border border-gray-200 rounded w-max px-2 py-0.5 bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="p-1 hover:text-[#6B1D2F]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-semibold px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="p-1 hover:text-[#6B1D2F]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#6B1D2F]/10 bg-white space-y-4">
              <div className="flex justify-between text-base font-bold text-[#2D2D2D]">
                <span>Subtotal</span>
                <span className="text-[#6B1D2F]">₹{getTotalPrice().toLocaleString('en-IN')}</span>
              </div>
              <p className="text-xs text-gray-500">Shipping & taxes calculated at checkout.</p>
              
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-[#6B1D2F] text-white font-semibold rounded hover:bg-[#521624] transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}