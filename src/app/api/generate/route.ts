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

        const prompt = `Highest-end architectural interior renovation of a ${zone} in ${style} style.
        SURFACE TRANSFORMATION RULES:
        1. FLOORING & SKIRTING: Replace old floors with seamless microcement or wide-plank oak. Add minimalist integrated flush skirting boards (rodapés embutidos).
        2. WALLS & TEXTURES: Apply smooth high-end plaster, concrete textures, or matte premium paint. Remove all outdated wallpapers or rough textures.
        3. CEILING & LIGHTING: Modern dropped ceiling (teto falso) with recessed anti-glare LED spotlights, perimeter hidden LED strips, and cinematic accent lighting.
        4. FIXTURES: Ultra-modern handles, switches, and high-design architectural details.
        VISUAL STYLE: Photorealistic, cinematic natural light, 8k resolution, magazine quality. KEEP ORIGINAL ROOM GEOMETRY EXACTLY.`;

        // Using the most stable and guaranteed version of SDXL (Stable Diffusion XL)
        // Set to high strength (0.8) to ensure the requested radical changes occur
        const prediction = await replicate.predictions.create({
            version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            input: {
                image: image,
                prompt: prompt,
                prompt_strength: 0.8, // TRANSFORM POWER: 80% change allowed
                num_inference_steps: 40,
                guidance_scale: 15, // Force obedience to the transformation prompt
                negative_prompt: "lowres, bad quality, blurry, distorted, messy, unfinished, unrealistic, old materials, original flooring, original ceiling"
            }
        });

        console.log('SDXL Prediction created:', prediction.id);

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
