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

        // ---------- Build prompt based on style/zone (HIGH-FIDELITY SURFACE REFRESH) ----------
        const prompt = `Premium architectural photograph of the ${zone} in the original image, with a high-end ${style} renovation. 
STRUCTURE: Every wall, window, door, and furniture piece remains in its exact pixel-perfect position. 
SURFACES: Replace textures with luxurious ${style} materials. Floors are polished ${style}, walls have smooth professional ${style} finishes. 
LIGHTING & AESTHETIC: Cinematic natural sunlight, volumetric soft shadows, 8k UHD, photoreal, shot on Phase One XF, 80mm lens, extremely detailed textures, interior design magazine award-winning quality. 
NO ARCHITECTURAL CHANGES.`;

        // ---------- Prediction using Image-to-Image (Img2Img) for 100% Structural Consistency ----------
        // Model: lucataco/flux-dev-lora
        console.log("Fetching version and generating with FLUX Dev Lora (Enhanced Visuals)...");
        const model = await replicate.models.get("lucataco", "flux-dev-lora");
        if (!model.latest_version) {
            throw new Error("Could not find the latest version for the FLUX model.");
        }

        const prediction = await replicate.predictions.create({
            version: model.latest_version.id,
            input: {
                prompt: prompt,
                image: resizedImage,
                prompt_strength: 0.68, // Slightly increased to allow more "beauty" without losing structure
                num_inference_steps: 35, // More steps for finer textures
                guidance_scale: 4.5,     // Stronger adherence to the "luxury" aspect of the prompt
            },
        });

        console.log('Flux Fill Dev Prediction created:', prediction.id);

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
