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

        // ---------- Build prompt based on style/zone (Preserving structure) ----------
        const prompt = `Professional architectural photo of a ${zone} renovated in ${style} style. 
The furniture layout, windows, doors, and architectural structure are strictly preserved from the original. 
The room is updated with new high-end ${style} materials, polished floors, modern fixtures, and lux finishes. 
Realistic interior design photography, sharp focus, natural lighting, 8k UHD, highly detailed.`;

        // ---------- Prediction using ControlNet for structural integrity ----------
        // Model: xlabs-ai/flux-dev-controlnet
        console.log("Fetching latest version for xlabs-ai/flux-dev-controlnet...");
        const model = await replicate.models.get("xlabs-ai", "flux-dev-controlnet");
        if (!model.latest_version) {
            throw new Error("Could not find the latest version for the ControlNet model.");
        }

        const prediction = await replicate.predictions.create({
            version: model.latest_version.id,
            input: {
                prompt: prompt,
                control_image: resizedImage,
                control_type: "depth", // Depth keeps the 'space' and 'volumes' consistent
                steps: 28,             // Matches model's current schema
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
