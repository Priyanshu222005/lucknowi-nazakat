import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter missing' }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug },
        ],
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('API Slug Error:', error?.message || error);

    try {
      const resolvedParams = params instanceof Promise ? await params : params;
      const productById = await prisma.product.findUnique({
        where: { id: resolvedParams.slug },
      });
      if (productById) {
        return NextResponse.json({ product: productById });
      }
    } catch (e) {}

    return NextResponse.json(
      { error: 'Failed to fetch product', message: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'ID missing' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: slug },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Product Error:', error?.message || error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}