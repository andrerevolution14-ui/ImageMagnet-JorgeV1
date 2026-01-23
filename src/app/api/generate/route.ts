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

        // ---------- Build prompt based on style/zone (SURFACE REPLACEMENT ONLY) ----------
        // We use a passive prompt to prevent the AI from "building" new architecture.
        const prompt = `Professional photo of the exact same room in the image, but with surfaces updated to ${style} style. 
The walls, floor, furniture layout, and windows are identical to the original image. 
Replace only the materials: update the floor to premium ${style} flooring, paint the walls in ${style} colors, and refresh the furniture textures. 
Magazine quality, sharp focus, natural lighting, 8k UHD.`;

        // ---------- Prediction using Image-to-Image (Img2Img) for 100% Structural Consistency ----------
        // Model: lucataco/flux-dev-lora
        // Using prompt_strength: 0.6 ensures we change colors/textures but KEEP ALL WALLS AND FURNITURE.
        console.log("Fetching version and generating with FLUX Dev Lora...");
        const model = await replicate.models.get("lucataco", "flux-dev-lora");
        if (!model.latest_version) {
            throw new Error("Could not find the latest version for the FLUX model.");
        }

        const prediction = await replicate.predictions.create({
            version: model.latest_version.id,
            input: {
                prompt: prompt,
                image: resizedImage, // Original image as the base
                prompt_strength: 0.6, // MAGIC NUMBER: High enough to change tiles/paint, low enough to keep walls.
                num_inference_steps: 30,
                guidance_scale: 3.5,
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
