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

        const prompt = `Hyper-realistic architectural interior renovation photography of a ${zone} in ${style} style. 
        MANDATORY RULES: 
        1. Keep the exact geometry of walls, windows, and doors from the original image. 
        2. Replace floor with high-end seamless large tiles or wide-plank wood. 
        3. Install modern minimalist skirting boards. 
        4. Smooth high-quality wall painting and textures. 
        5. Modern drop ceiling with recessed architectural LED lighting.
        STYLE: Professional high-end magazine photography, cinematic lighting, 8k resolution, photorealistic, no distortion, no hallucinations.`;

        // Using Specialized Interior Design SDXL - Purpose-built for high-end renovation
        // Model: rocketdigitalai/interior-design-sdxl
        const prediction = await replicate.predictions.create({
            version: "a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f59ee",
            input: {
                image: image,
                prompt: prompt,
                negative_prompt: "distorted, low quality, blurry, fuzzy, messy, cluttered, out of focus, watermark, text, signature, bad architecture, unrealistic, deformed walls, crooked floors, extra windows, extra doors",
                depth_strength: 0.85,
                guidance_scale: 8.0,
                promax_strength: 0.85,
                refiner_strength: 0.4,
                num_inference_steps: 28
            }
        });

        console.log('Interior Design SDXL Prediction created:', prediction.id);

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
