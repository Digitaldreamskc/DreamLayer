import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid bundling issues
    const { default: Irys } = await import('@irys/sdk');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const irys = new Irys({
      network: "devnet",
      token: "ethereum", 
      key: process.env.IRYS_PRIVATE_KEY,
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const response = await irys.upload(buffer, {
      tags: [
        { name: "Content-Type", value: file.type },
        { name: "App-Name", value: "DreamLayer" }
      ]
    });

    return NextResponse.json({ 
      id: response.id,
      url: `https://gateway.irys.xyz/${response.id}`
    });

  } catch (error) {
    console.error('Irys upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
