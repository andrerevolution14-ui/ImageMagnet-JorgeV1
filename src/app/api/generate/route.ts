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

        const prompt = `Professional real estate renovation photography of a ${zone} in ${style} style. 
        EXECUTE THESE RENOVATION PATTERNS:
        1. Replace old tiles with large-format marble or matte porcelain.
        2. Replace old fixtures with modern wall-hung toilets and sleek minimalist faucets.
        3. Install luxury cabinetry with integrated LED strip lighting.
        4. Bright white ceilings and walls with cinematic architectural lighting.
        5. Use a palette of oak wood, soft greys, and crisp whites.
        PHOTO STANDARDS: 8k resolution, razor sharp, high-end interior design magazine style. Identical room structure to original.`;

        // Using standard SDXL - the most reliable for these specific renovation patterns
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
