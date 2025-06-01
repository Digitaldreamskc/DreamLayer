import { NextRequest, NextResponse } from 'next/server';
import Irys from '@irys/sdk';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Initialize Irys on server-side
    const irys = new Irys({
      network: 'devnet', // Use 'mainnet' for production
      token: 'ethereum',
      key: process.env.IRYS_PRIVATE_KEY, // Your wallet's private key
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Irys
    const response = await irys.upload(buffer, {
      tags: [
        { name: 'Content-Type', value: file.type },
        { name: 'App-Name', value: 'DreamLayer' }
      ]
    });

    return NextResponse.json({ 
      id: response.id,
      url: `https://gateway.irys.xyz/${response.id}`
    });

  } catch (error) {
    console.error('Irys upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    );
  }
} 