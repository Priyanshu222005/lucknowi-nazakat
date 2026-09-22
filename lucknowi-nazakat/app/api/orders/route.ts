import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, paymentMethod, paymentId, orderId, customerDetails } = body;

    const newOrder = await prisma.order.create({
      data: {
        totalAmount: Number(totalAmount),
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        paymentId: paymentId || null,
        razorpayOrderId: orderId || null,
        status: 'PLACED',
        items: JSON.stringify(items || []),
        customerName: customerDetails?.name || 'Guest Customer',
        customerEmail: customerDetails?.email || '',
        customerPhone: customerDetails?.phone || '',
        shippingAddress: JSON.stringify(customerDetails?.address || {}),
      },
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
  }
}