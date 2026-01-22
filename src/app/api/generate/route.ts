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

        // Using FLUX with ControlNet Canny - The absolute highest quality for architecture
        // This ensures the room structure is 100% preserved while changing materials
        const prediction = await replicate.predictions.create({
            version: "a4369e5d677a288414a3838a4d3393b482d8c3397960fc5d4c887fb7349b1ca2",
            input: {
                control_image: image, // Canny control image
                prompt: prompt,
                control_type: "canny",
                num_steps: 25,
                guidance: 3.5,
                conditioning_scale: 0.9, // High structural preservation
                output_format: "jpg",
                output_quality: 90
            }
        });

        console.log('Flux ControlNet Prediction created:', prediction.id);

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
