'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutModule() {
  const router = useRouter();
  const { cart, totalAmount, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD');
  const [loading, setLoading] = useState(false);

  // Customer Details State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Uttar Pradesh',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrderProcess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Kripya saari mandatory shipping details bharein!');
      return;
    }

    if (cart.length === 0) {
      alert('Aapka cart khali hai! Kripya pehle product add karein.');
      return;
    }

    setLoading(true);

    try {
      const customerDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          state: formData.state,
        },
      };

      // 1. CASH ON DELIVERY (COD) FLOW
      if (paymentMethod === 'COD') {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart,
            totalAmount: totalAmount,
            paymentMethod: 'COD',
            customerDetails,
          }),
        });

        if (res.ok) {
          alert('📦 Cash on Delivery Order Successfully Place Ho Gaya!');
          clearCart();
          router.push('/admin/orders');
        } else {
          alert('COD order place karne mein dikkat aayi.');
        }
        setLoading(false);
        return;
      }

      // 2. RAZORPAY ONLINE PAYMENT FLOW
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK load nahi hua. Kripya internet connection check karein.');
        setLoading(false);
        return;
      }

      const orderRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Razorpay order creation fail ho gaya.');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Lucknowi Nazakat',
        description: `Purchase of ${cart.length} item(s)`,
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: cart,
                totalAmount: totalAmount,
                paymentMethod: 'RAZORPAY',
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                customerDetails,
              }),
            });

            alert('🎉 Payment Successful! Order Placed.');
            clearCart();
            router.push('/admin/orders');
          } else {
            alert('❌ Payment verification fail ho gaya!');
          }
        },
        theme: { color: '#6B1D2F' },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      alert(err.message || 'Transaction fail ho gaya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleOrderProcess} className="space-y-6 bg-stone-50 p-6 rounded-lg border border-stone-200">
      <h3 className="font-serif text-lg font-bold text-[#6B1D2F] border-b pb-2">Shipping Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Priyanshu Mohanty"
            className="w-full border rounded p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="9508393494"
            className="w-full border rounded p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="priyanshu@example.com"
            className="w-full border rounded p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-700 mb-1">Full Address *</label>
          <textarea
            name="address"
            required
            rows={2}
            value={formData.address}
            onChange={handleChange}
            placeholder="House No, Street, Landmark"
            className="w-full border rounded p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">City / Town *</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="Lucknow"
            className="w-full border rounded p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            required
            value={formData.pincode}
            onChange={handleChange}
            placeholder="226001"
            className="w-full border rounded p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-[#6B1D2F]"
          />
        </div>
      </div>

      <h3 className="font-serif text-lg font-bold text-[#6B1D2F] border-b pb-2 pt-2">Payment Option</h3>

      <div className="space-y-2">
        <label className="flex items-center space-x-3 p-3 bg-white rounded border cursor-pointer hover:bg-stone-100">
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === 'COD'}
            onChange={() => setPaymentMethod('COD')}
            className="accent-[#6B1D2F]"
          />
          <span className="text-xs font-semibold text-stone-800">Cash on Delivery (COD)</span>
        </label>

        <label className="flex items-center space-x-3 p-3 bg-white rounded border cursor-pointer hover:bg-stone-100">
          <input
            type="radio"
            name="payment"
            value="RAZORPAY"
            checked={paymentMethod === 'RAZORPAY'}
            onChange={() => setPaymentMethod('RAZORPAY')}
            className="accent-[#6B1D2F]"
          />
          <span className="text-xs font-semibold text-stone-800">Online Payment (UPI, Cards, Netbanking)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6B1D2F] text-white py-3 rounded font-bold text-xs uppercase tracking-wider hover:bg-[#521624] transition shadow cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Processing Order...' : paymentMethod === 'COD' ? `Place Order (COD - ₹${totalAmount})` : `Pay ₹${totalAmount} Online`}
      </button>
    </form>
  );
}