import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { amount, currency = 'INR' } = await request.json();

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if actual test keys exist and are not placeholder dummies
    const isRealKeyAvailable = keyId && keySecret && !keyId.includes('1234567890') && !keySecret.includes('mock');

    if (isRealKeyAvailable) {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt: `receipt_${Date.now()}`,
      });
      return NextResponse.json(order, { status: 200 });
    }

    // Mock Order Response for Local Development Testing
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      entity: 'order',
      amount: Math.round(amount * 100),
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: currency,
      receipt: `receipt_mock_${Date.now()}`,
      status: 'created',
      attempts: 0,
      notes: [],
      created_at: Math.floor(Date.now() / 1000),
    };

    return NextResponse.json(mockOrder, { status: 200 });
  } catch (error: any) {
    console.error('Razorpay Order Creation Error:', error);
    return NextResponse.json({ error: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}