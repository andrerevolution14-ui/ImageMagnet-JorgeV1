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

        const prompt = `Complete interior renovation of this exact ${zone} in ${style} style. 
        High-end material transformation.
        FLOORING: Install premium new floor appropriate for ${style}.
        WALLS: Fresh luxury paint/finish, pristine condition.
        FURNITURE: Brand new high-design ${style} furniture placed in similar arrangement.
        LIGHTING: Bright, warm, architectural LED lighting.
        ATMOSPHERE: Expensive, clean, magazine quality.
        IMPORTANT: Keep the room geometry, windows, and doors exactly as they are. Just upgrade every surface and object.`;

        const output = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            {
                input: {
                    image: image,
                    prompt: prompt,
                    prompt_strength: 0.55,
                    num_inference_steps: 30, // Optimized for speed on Vercel
                    guidance_scale: 12, // Slightly lower for faster convergence
                    negative_prompt: "broken geometry, crooked walls, floating furniture, messy, dirty, old, construction site, blur, low resolution, distorted windows, weird perspective"
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
