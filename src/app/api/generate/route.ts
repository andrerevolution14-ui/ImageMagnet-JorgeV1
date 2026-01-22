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

        // Using FLUX Fill Dev - The state-of-the-art model from Black Forest Labs
        // We use a 1x1 white pixel mask to tell the AI to "refill" the whole image area
        const fullMask = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

        const prediction = await replicate.predictions.create({
            model: "black-forest-labs/flux-fill-dev",
            input: {
                image: image,
                mask: fullMask, // Tells FLUX to process the entire area
                prompt: prompt,
                guidance: 30, // High guidance for high-end results
                num_steps: 30,
                output_format: "jpg",
                output_quality: 90,
                prompt_upsampling: true // Improves the detail of materials
            }
        });

        console.log('Flux Fill Prediction created:', prediction.id);

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
