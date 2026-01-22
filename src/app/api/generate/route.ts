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

        // Using jagilley/controlnet-hough - The absolute best for house remodeling
        // This is Stable Diffusion + architectural line detection (Hough)
        const prediction = await replicate.predictions.create({
            version: "854e961d50116671fa843336423985d3662bba65bdcb6440c9ae151cb820fd6",
            input: {
                image: image,
                prompt: prompt,
                a_prompt: "best quality, extremely detailed, real architecture, luxury materials, professional lighting, 8k resolution",
                n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, distorted, messy, unfinished",
                num_samples: "1",
                image_resolution: "768",
                ddim_steps: 20,
                scale: 9,
                eta: 0
            }
        });

        console.log('ControlNet Prediction created:', prediction.id);

        return NextResponse.json(prediction);
    } catch (error: any) {
        console.error('Replicate error full details:', error);
        return NextResponse.json({
            error: error.message || 'Failed to start generation',
            details: error.toString()
        }, { status: 500 });
    }
}
