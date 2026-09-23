import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const uppercaseCode = code.toUpperCase().trim();

    // Sample Server Coupon Validation Rules
    if (uppercaseCode === 'NAZAKAT10') {
      if (cartTotal < 999) {
        return NextResponse.json(
          { error: 'Minimum order value of ₹999 required for this coupon.' },
          { status: 400 }
        );
      }
      const discount = Math.round((cartTotal * 10) / 100);
      return NextResponse.json({
        success: true,
        code: uppercaseCode,
        discountAmount: discount,
        message: '10% Discount applied successfully!',
      });
    }

    if (uppercaseCode === 'FESTIVE500') {
      if (cartTotal < 2999) {
        return NextResponse.json(
          { error: 'Minimum order value of ₹2999 required for FESTIVE500.' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        code: uppercaseCode,
        discountAmount: 500,
        message: 'Flat ₹500 OFF applied successfully!',
      });
    }

    return NextResponse.json({ error: 'Invalid or expired coupon code.' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Server validation failed' }, { status: 500 });
  }
}