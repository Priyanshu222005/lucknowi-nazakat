import { NextResponse } from 'next/server';

import { createProduct, getAllProducts } from '@/lib/services/productService';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await createProduct({
      ...body,
      image: body.image ?? body.imageUrl,
      stock: body.stock ?? (body.inStock === false ? 0 : 10),
    });

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
      },
      { status: 500 }
    );
  }
}