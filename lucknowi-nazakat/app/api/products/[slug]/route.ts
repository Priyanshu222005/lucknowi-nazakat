import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params; // Yahan 'slug' parameter ka matlab product ID hai

    if (!slug) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Direct search by ID only (Since Prisma schema doesn't have slug column)
    const product = await prisma.product.findUnique({
      where: { id: slug },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      category: product.category || 'Chikankari',
      description: product.description || 'Authentic hand-embroidered Lucknowi Chikankari.',
      image: product.imageUrl || product.image || '/images/placeholder.jpg',
    });
  } catch (error) {
    console.error('API Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product from database' },
      { status: 500 }
    );
  }
}