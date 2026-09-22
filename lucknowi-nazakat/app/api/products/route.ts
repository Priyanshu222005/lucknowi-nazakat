import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// Base64 image ko file mein save karke uska public path return karta hai
function saveBase64Image(base64String: string): string {
  // "data:image/png;base64,iVBORw0KGgo..." ko split karo
  const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    // Agar format match na ho to placeholder use karo
    return '/images/placeholder.jpg';
  }

  const extension = matches[1]; // jaise "png", "jpeg"
  const data = matches[2];      // actual base64 data

  // Unique filename banao
  const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;

  // uploads folder ka path (public ke andar)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  // Agar folder exist nahi karta to bana do
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);

  // Base64 ko binary buffer mein convert karke file save karo
  fs.writeFileSync(filePath, data, 'base64');

  // Browser se access hone wala path return karo
  return `/uploads/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { 
      name, 
      category, 
      price, 
      originalPrice, 
      description, 
      image, 
      isNew, 
      isBestSeller, 
      isFeatured 
    } = body;

    // Image ko sahi se handle karo
    let finalImage = '/images/placeholder.jpg';

    if (image && image.trim().length > 0) {
      if (image.startsWith('data:image')) {
        // Base64 image hai — file mein save karo
        finalImage = saveBase64Image(image);
      } else {
        // Pehle se ek URL hai
        finalImage = image;
      }
    }

    const finalName = String(name || 'Chicken Curry Kurta');
    const slug = finalName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const productData: any = {
      name: finalName,
      slug: slug,
      category: String(category || 'Men'),
      price: Number(price) || 3000,
      originalPrice: originalPrice ? Number(originalPrice) : null,
      description: String(description || 'Authentic Lucknowi Handcrafted Chikankari Cotton Kurta'),
      images: JSON.stringify([finalImage]),
      isNewArrival: Boolean(isNew ?? true),
      isBestSeller: Boolean(isBestSeller ?? false),
      isFeatured: Boolean(isFeatured ?? false),
      stock: 50,
    };

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Prisma Create Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product in Database' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}