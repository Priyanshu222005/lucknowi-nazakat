import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Unique filename generating
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(process.cwd(), 'public/uploads', filename);

    // Save image to public/uploads folder
    await writeFile(filePath, buffer);

    // Return relative public URL
    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    console.error('File Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}