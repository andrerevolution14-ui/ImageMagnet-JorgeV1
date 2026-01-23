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

        // Map styles to more descriptive English terms to avoid "futuristic" interpretations
        const styleMap: Record<string, string> = {
            'Moderno': 'modern and contemporary',
            'Minimalista': 'minimalist and clean',
            'Rústico': 'rustic and warm'
        };

        const descriptiveStyle = styleMap[style] || style;

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
        console.log(`[API] Fetching model version for xlabs-ai/flux-dev-controlnet...`);
        const model = await replicate.models.get("xlabs-ai", "flux-dev-controlnet");
        if (!model.latest_version) {
            console.error("[API] Could not find latest version for xlabs-ai/flux-dev-controlnet");
            throw new Error("Could not find the latest version for the ControlNet model.");
        }

        console.log(`[API] Starting prediction for style: ${style}, zone: ${zone}...`);
        const prediction = await replicate.predictions.create({
            version: model.latest_version.id,
            input: {
                prompt: `Realistic professional architectural photography of this ${zone}, ${descriptiveStyle} renovation. Natural textures, real-world materials, authentic furniture. The window position, room dimensions, and structural layout are strictly preserved from the original image. Soft natural lighting, sharp focus, grounded professional interior design. Cozy and lived-in feel, realistic home environment, no futuristic elements.`,
                control_image: resizedImage,
                control_type: "canny",
                control_strength: 0.85,
                steps: 40,
                guidance_scale: 4.0,   // Slightly lower guidance for more natural, less "AI-generated" look
                output_quality: 100,
                negative_prompt: "futuristic, neon, sci-fi, artificial purple light, space-age, plastic, glossy, blur, distorted, extra furniture, moving walls, modifying windows, low resolution",
            },
        });

        console.log('[API] Prediction created successfully:', prediction.id);

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
