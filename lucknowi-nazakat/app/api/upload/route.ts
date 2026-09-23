import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';

    // Agar Cloudinary env settings preset hai
    if (cloudName) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', uploadPreset);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: uploadData,
        }
      );

      const data = await cloudinaryRes.json();
      if (data.secure_url) {
        return NextResponse.json({ url: data.secure_url });
      }
    }

    // Fallback: Convert file to Base64 Image URL directly
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/png';
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({ url: base64Image });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed on server' }, { status: 500 });
  }
}