import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount,
      paymentMethod,
      razorpayPaymentId,
    } = body;

    const productsInDb = await prisma.product.findMany();
    const defaultProduct = productsInDb[0];

    const itemsToCreate = (items || []).map((item: any) => {
      const dbMatch = productsInDb.find(
        (p) => String(p.id) === String(item.id) || p.name === item.name
      );
      const matched = dbMatch || defaultProduct;

      return {
        productId: matched ? String(matched.id) : String(item.id || '1'),
        quantity: parseInt(String(item.quantity || 1), 10),
        price: parseFloat(String(item.price || matched?.price || 0)),
        size: String(item.size || 'M'),
      };
    });

    const newOrder = await prisma.order.create({
      data: {
        customerName: String(customerName || 'Customer'),
        email: String(email || ''),
        phone: String(phone || ''),
        address: String(address || ''),
        city: String(city || 'Lucknow'),
        state: String(state || 'Uttar Pradesh'),
        pincode: String(pincode || '226001'),
        totalAmount: parseFloat(String(totalAmount || 0)),
        paymentMethod: String(paymentMethod || 'COD'),
        paymentStatus: razorpayPaymentId ? 'PAID' : 'PENDING',
        razorpayPaymentId: razorpayPaymentId ? String(razorpayPaymentId) : null,
        items: {
          create: itemsToCreate,
        },
      },
      include: { items: true },
    });

    // Console log simulating Automated Email Trigger
    console.log(`📧 Notification: Order confirmation email triggered for ${email || customerName}`);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Order creation failed' },
      { status: 500 }
    );
  }
}