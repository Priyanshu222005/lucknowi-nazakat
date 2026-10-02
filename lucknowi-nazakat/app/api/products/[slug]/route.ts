import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET - Fetch single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'ID/Slug is required' }, { status: 400 });
    }

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
      description: product.description || '',
      image: product.imageUrl || product.image || '/images/placeholder.jpg',
    });
  } catch (error) {
    console.error('API Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// 2. PATCH - Update product (Admin Edit)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id: slug },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.price && { price: parseFloat(body.price) }),
        ...(body.category && { category: body.category }),
        ...(body.description && { description: body.description }),
        ...(body.image && { imageUrl: body.image }),
        ...(body.imageUrl && { imageUrl: body.imageUrl }),
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('API Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// 3. DELETE - Delete product (Admin Remove)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.product.delete({
      where: { id: slug },
    });

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}