import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import sharp from 'sharp';

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

        // Prompt will be built later with ControlNet integration



        // Helper to resize a base64 image to max 1024px width (preserving aspect ratio)
        const resizeBase64Image = async (base64: string): Promise<string> => {
            // Remove possible data URI prefix
            const matches = base64.match(/^data:(image\/\w+);base64,(.*)$/);
            const mime = matches ? matches[1] : 'image/jpeg';
            const data = matches ? matches[2] : base64;
            const buffer = Buffer.from(data, 'base64');
            const resized = await sharp(buffer)
                .resize({ width: 1024, withoutEnlargement: true })
                .toFormat('jpeg')
                .toBuffer();
            return `data:${mime};base64,${resized.toString('base64')}`;
        };

        // --- Preprocess input image (resize to 1024px max) ---
        const resizedImage = await resizeBase64Image(image);

        // ---------- Prediction using ControlNet for 100% Structural Consistency + Radical Renovation ----------
        // Model: xlabs-ai/flux-dev-controlnet
        console.log("Fetching version and generating with XLabs ControlNet (Depth) for total renovation...");
        const model = await replicate.models.get("xlabs-ai", "flux-dev-controlnet");
        if (!model.latest_version) {
            throw new Error("Could not find the latest version for the ControlNet model.");
        }

        const prediction = await replicate.predictions.create({
            version: model.latest_version.id,
            input: {
                prompt: `A total high-end ${style} interior design makeover of this ${zone}. MANDATORY: Every window, window frame, and window opening from the original image MUST be preserved exactly in its position. Do not cover or replace windows with walls. RENOVATE SURFACES: Update the couch with premium ${style} fabrics, the walls with ${style} finishes, and the floor with ${style} materials. The 3D layout and furniture positions must be 100% identical to the original image. Cinematic lighting, 8k, photorealistic, architectural magazine quality.`,
                control_image: resizedImage,
                control_type: "depth",
                control_strength: 0.9,
                steps: 30,
                guidance_scale: 5.0,
                negative_prompt: "removing windows, covering windows, wall replacing window, structural changes, new windows in wrong places, changing room layout, distorted perspective, extra furniture, blurry, low quality",
            },
        });

        console.log('ControlNet Canny Prediction created:', prediction.id);

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
