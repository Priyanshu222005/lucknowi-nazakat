import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    // Handle both Promise and direct object params
    const resolvedParams = params instanceof Promise ? await params : params;
    const { slug } = resolvedParams;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter missing' }, { status: 400 });
    }

    // Safely query database
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
    
    // Fallback search by ID directly
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