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

        const prompt = `Professional high-end interior design photography of a ${zone}, remodeled in ${style} style. 
        Luxury materials, soft window lighting, cinematic architectural photography, clean and bright. 
        Highly detailed textures, photorealistic, 8k resolution.
        The structural layout, windows, and walls MUST remain identical to the original.`;

        // Using SDXL Lightning for extreme speed and high quality on Vercel
        const output = await replicate.run(
            "stability-ai/sdxl-lightning-4step:727e49a643e13005eafda46da92931754406606fbf63266e1336fa999e5258e7",
            {
                input: {
                    image: image,
                    prompt: prompt,
                    prompt_strength: 0.5, // Perfect balance for renovation
                    num_inference_steps: 4, // Lightning only needs 4 steps for amazing quality
                    guidance_scale: 1, // Lightning uses low guidance
                    negative_prompt: "distorted, blurry, fake, cartoon, drawing, painting, bad furniture, messy room, low quality, warped walls"
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
