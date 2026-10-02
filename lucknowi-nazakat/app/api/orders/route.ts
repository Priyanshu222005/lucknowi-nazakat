import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders || [], { status: 200 });
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array on error to prevent JSON parse crash
  }
}