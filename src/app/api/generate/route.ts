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

        const prompt = `Highly detailed architectural photography of a ${zone} remodeled in ${style} style. 
        Luxury interior design, professional lighting, soft natural sunlight from windows. 
        Premium ${style} furniture, realistic textures on flooring and walls.
        Magazine quality, clean, photorealistic, 8k resolution.
        The layout and structure of the room must remain identical to the original image.`;

        const output = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            {
                input: {
                    image: image,
                    prompt: prompt,
                    prompt_strength: 0.5, // 50/50 balance for realism
                    num_inference_steps: 30,
                    guidance_scale: 7.5, // Standard scale to avoid "fried" colors and AI artifacts
                    negative_prompt: "distorted, fake, cartoon, drawing, painting, oversaturated, weird colors, messy, blurry, low quality, deformed furniture"
                }
            }
        );

        console.log('Replicate Output:', output);

        const imageUrl = Array.isArray(output) ? output[0] : output;

        return NextResponse.json({ output: imageUrl });
    } catch (error: any) {
        console.error('Replicate error full details:', error);
        return NextResponse.json({
            error: error.message || 'Failed to generate image',
            details: error.toString()
        }, { status: 500 });
    }
}
