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

        // ---------- Build prompt based on style/zone (STRICT RENOVATION) ----------
        const prompt = `A professional ${style} style renovation of the existing ${zone}. 
STRICT RULES: 
1. The architectural layout, wall positions, and window/door locations MUST stay exactly the same.
2. The outdoor garden/patio visible through glass doors MUST remain an outdoor area; do not turn it into an indoor room.
3. Keep the furniture in their original positions, just update their materials and style to ${style}.
4. NO NEW WINDOWS or doors should be added to the walls.
Update only the textures: high-end ${style} flooring, wall finishes, and modern lighting. Magazine quality, 8k UHD.`;

        const negative_prompt = "additional windows, additional doors, converting garden to indoor room, changing wall positions, changing floor plan, distorted architecture, indoor furniture in outdoor garden";

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
                negative_prompt: negative_prompt, // Prevent unwanted structural changes
                control_image: resizedImage,
                control_type: "canny", // Canny is more strict with edges/lines than depth
                steps: 28,
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
