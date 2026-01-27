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

        // Map styles to more descriptive English terms
        const styleMap: Record<string, string> = {
            'Moderno': 'modern luxury',
            'Minimalista': 'minimalist and clean',
            'Rústico': 'rustic and warm'
        };

        // Map zones to English for the AI
        const zoneMap: Record<string, string> = {
            'Cozinha': 'kitchen',
            'Sala': 'living room',
            'Quarto': 'bedroom',
            'Casa de Banho': 'bathroom'
        };

        const descriptiveStyle = styleMap[style] || style;
        const descriptiveZone = zoneMap[zone] || zone;

        // Helper to resize a base64 image to max 768px width (preserving aspect ratio)
        const resizeBase64Image = async (base64: string): Promise<string> => {
            const matches = base64.match(/^data:(image\/\w+);base64,(.*)$/);
            const data = matches ? matches[2] : base64;
            const buffer = Buffer.from(data, 'base64');
            const resized = await sharp(buffer)
                .resize({ width: 768, withoutEnlargement: true })
                .toFormat('jpeg', { quality: 80 })
                .toBuffer();
            return `data:image/jpeg;base64,${resized.toString('base64')}`;
        };

        // --- Preprocess input image (resize to 768px max for faster upload and processing) ---
        console.log("[API] Resizing image...");
        const resizedImage = await resizeBase64Image(image);
        console.log("[API] Image resized. Length:", resizedImage.length);

        console.log(`[API] Starting prediction for style: ${descriptiveStyle}, zone: ${descriptiveZone}...`);

        const prediction = await replicate.predictions.create({
            model: "black-forest-labs/flux-depth-pro",
            input: {
                control_image: resizedImage,
                prompt: `A stunning professional ${descriptiveStyle} interior design renovation of this ${descriptiveZone}. Clean lines, premium materials, sophisticated lighting, architectural photography, 8k resolution, highly detailed, realistic.`,
                steps: 20, // Optimized for speed while maintaining quality
                guidance: 3.0, // Balanced for good results and faster generation
                output_format: "jpg",
                safety_tolerance: 2
            },
        });

        console.log('[API] Prediction created successfully:', prediction.id);

        return NextResponse.json(prediction);
    } catch (error: any) {
        console.error('Final attempt error:', error);
        return NextResponse.json({
            error: "Erro na IA: " + (error.message || 'Falha ao iniciar geração'),
            details: error.toString()
        }, { status: 500 });
    }
}
