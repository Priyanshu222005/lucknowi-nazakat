import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, originalPrice, description, isNew, isBestSeller, isFeatured } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : parsedPrice;
    
    // Calculate discount percentage automatically if original price is higher
    let discountPercentage = 0;
    if (parsedOriginalPrice > parsedPrice) {
      discountPercentage = Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100);
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || 'Premium Lucknowi Chikankari Apparel',
        price: parsedPrice,
        originalPrice: parsedOriginalPrice,
        discountPercentage,
        images: JSON.stringify(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80']),
        category,
        stock: 10,
        isNewArrival: Boolean(isNew ?? true),
        isBestSeller: Boolean(isBestSeller ?? false),
        isFeatured: Boolean(isFeatured ?? false),
        isOnSale: discountPercentage > 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Product Creation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}