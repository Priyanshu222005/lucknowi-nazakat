'use client';

import { useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Priyanshu',
    email: 'priyanshu@example.com',
    phone: '9876543210',
    address: 'Boutique Store, Lucknow',
  });

  const totalAmount = 1499;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const isRealKey = razorpayKey && !razorpayKey.includes('1234567890');

      if (isRealKey && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Lucknowi Nazakat',
          description: 'Authentic Chikankari Purchase',
          order_id: orderData.id,
          handler: function (response: any) {
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
            router.push('/shop');
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: '#6B1D2F' },
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        setTimeout(() => {
          alert(`[TEST MODE] Order Placed Successfully!\n\nOrder ID: ${orderData.id}\nAmount: ₹${totalAmount}\nCustomer: ${formData.name}`);
          router.push('/shop');
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Payment Error: ${err.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-stone-200">
          <h1 className="text-3xl font-serif font-bold text-[#6B1D2F] mb-6">Checkout & Payment</h1>
          
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-stone-300 rounded-lg text-stone-900 bg-white font-semibold focus:ring-2 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-stone-300 rounded-lg text-stone-900 bg-white font-semibold focus:ring-2 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-stone-300 rounded-lg text-stone-900 bg-white font-semibold focus:ring-2 focus:ring-[#6B1D2F] focus:border-[#6B1D2F] outline-none transition"
              />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-stone-500">Total Payable Amount</p>
              <p className="text-2xl font-bold text-[#6B1D2F]">₹{totalAmount}</p>
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="bg-[#6B1D2F] hover:bg-[#521624] text-[#D4AF37] px-8 py-3 rounded-lg font-semibold transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay via Razorpay'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}