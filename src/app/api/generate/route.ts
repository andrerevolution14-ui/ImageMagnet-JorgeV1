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

        // STRATEGY: "Renovation Mode"
        // Strength 0.55 is the "Sweet Spot".
        // < 0.45 = No visible change (Too similar)
        // > 0.65 = Hallucinations (Walls moving, distortion)
        // 0.55 = Perfect balance for changing materials/furniture while keeping walls fixed.

        const prompt = `Highest quality professional interior design photography of a luxury ${style} ${zone}. 
        Cinematic lighting, clean architectural textures, photorealistic, 8k resolution.
        The structural layout and walls must match the original image exactly.`;

        // Using standard SDXL - extremely stable for img2img
        const prediction = await replicate.predictions.create({
            version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input: {
                image: image,
                prompt: prompt,
                prompt_strength: 0.5,
                num_inference_steps: 30,
                guidance_scale: 7.5,
                negative_prompt: "distorted, blurry, fake, cartoon, drawing, painting, bad furniture, messy room, low quality, warped walls, extra legs, deformed"
            }
        });

        console.log('Prediction created:', prediction.id);

        return NextResponse.json(prediction);
    } catch (error: any) {
        console.error('Replicate error full details:', error);
        return NextResponse.json({
            error: error.message || 'Failed to start generation',
            details: error.toString()
        }, { status: 500 });
    }
}
