import { NextResponse } from 'next/server';

import {
  deleteProduct,
  getProductById,
  updateProduct,
} from '@/lib/services/productService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await getProductById(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('GET Product Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await updateProduct(slug, {
      ...body,
      image: body.image ?? body.imageUrl,
      stock: body.stock ?? (body.inStock === false ? 0 : 10),
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('PATCH Product Error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await deleteProduct(slug);

    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Product Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}