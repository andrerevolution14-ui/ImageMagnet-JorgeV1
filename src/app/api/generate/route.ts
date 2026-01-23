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

        const prompt = `Award-winning architectural interior photography of a ${zone} in ${style} style. 
        MANDATORY ELEMENTS: 
        - High-end luxurious materials, ray-traced reflections, and soft global illumination.
        - Floor: Professional large-format seamless tiles or premium wide-plank oak wood with realistic grain.
        - Walls & Ceiling: Ultra-smooth plaster, architectural minimalist skirting, and integrated warm LED lighting.
        - Lighting: Natural sunlight streaming through windows, cinematic shadows, polished atmosphere.
        - Quality: Photorealistic, 8k resolution, highly detailed textures, depth of field, sharp focus, magazine quality, no distortion.`;

        // Using Specialized Interior Design SDXL - Purpose-built for high-end renovation
        // Model: rocketdigitalai/interior-design-sdxl
        const prediction = await replicate.predictions.create({
            version: "a3c091059a25590ce2d5ea13651fab63f447f21760e50c358d4b850e844f59ee",
            input: {
                image: image,
                prompt: prompt,
                negative_prompt: "cartoon, drawing, painting, 3d render, anime, low quality, blurry, distorted architecture, messy, cluttered, out of focus, watermark, low resolution, unrealistic lighting, flat colors",
                depth_strength: 0.85,
                guidance_scale: 8.5,
                promax_strength: 0.9,
                refiner_strength: 0.5,
                num_inference_steps: 35
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
