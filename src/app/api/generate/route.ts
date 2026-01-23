import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function POST(req: NextRequest) {
    try {
        console.log("API Route /generate called");

        if (!process.env.REPLICATE_API_TOKEN) {
            console.error("Missing REPLICATE_API_TOKEN");
            return NextResponse.json({ error: 'Server misconfiguration: Missing API Token' }, { status: 500 });
        }

        const { image, style, zone } = await req.json();

        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        console.log(`Generating for ${zone} in ${style}...`);

        // Professional architectural photography prompt
        const prompt = `Professional architectural photography, interior design magazine style, ${zone} fully renovated in ${style}, high-end materials, cinematic natural lighting, 8k UHD, highly detailed, photorealistic, clean lines, luxury furniture.`;

        // Using FLUX Fill Dev - Optimized for speed and quality
        // Model: black-forest-labs/flux-fill-dev
        const prediction = await replicate.predictions.create({
            version: "a053f84125613d83e65328a289e14eb6639e10725c243e8fb0c24128e5573f4c",
            input: {
                image: image,
                prompt: prompt,
                num_inference_steps: 20,
                guidance: 30,
                megapixels: "1",
                output_format: "jpg",
                output_quality: 95,
                disable_safety_checker: false
            }
        });

        console.log('Flux Fill Dev Prediction created:', prediction.id);

        if (prediction.error) {
            return NextResponse.json({ error: prediction.error }, { status: 500 });
        }

        return NextResponse.json(prediction);
    } catch (error: any) {
        console.error('Final attempt error:', error);
        return NextResponse.json({
            error: "Erro na IA: " + (error.message || 'Falha ao iniciar geração'),
            details: error.toString()
        }, { status: 500 });
    }
}
