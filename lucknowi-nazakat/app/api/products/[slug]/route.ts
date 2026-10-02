import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET Single Product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string; id?: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.slug || resolvedParams.id;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PATCH / PUT - Mark Out of Stock / Update Product Status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug?: string; id?: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.slug || resolvedParams.id;
    const body = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(body.inStock !== undefined && { inStock: body.inStock }),
        ...(body.isOutOfStock !== undefined && { inStock: !body.isOutOfStock }),
        ...(body.name && { name: body.name }),
        ...(body.price && { price: parseFloat(body.price) }),
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('PATCH Error:', error);
    return NextResponse.json({ error: 'Failed to update product status' }, { status: 500 });
  }
}

// DELETE - Remove Product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug?: string; id?: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.slug || resolvedParams.id;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}