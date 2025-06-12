import { NextRequest } from 'next/server';
import { uploadToIrys } from '@/lib/irys';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return new Response(JSON.stringify({ error: 'No file provided' }), {
                status: 400,
            });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const contentType = file.type;

        const result = await uploadToIrys(buffer, contentType);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process upload' }), 
            { status: 500 }
        );
    }
}