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
        console.log("[API] Resizing image...");
        const resizedImage = await resizeBase64Image(image);
        console.log("[API] Image resized. Length:", resizedImage.length);

        // ---------- DRAMATIC TRANSFORMATION MODEL ----------
        // Model: black-forest-labs/flux-depth-pro (Allows RADICAL changes while preserving structure)
        // Depth control = preserves room layout but allows complete material/color transformation
        console.log(`[API] Starting prediction for style: ${style}, zone: ${zone}...`);

        const prediction = await replicate.predictions.create({
            model: "black-forest-labs/flux-depth-pro",
            input: {
                control_image: resizedImage,
                prompt: `Stunning modern ${descriptiveStyle} transformation of this ${zone}. Contemporary renovation featuring: sleek ${descriptiveStyle} furniture with clean lines, eye-catching sophisticated color scheme, premium flooring, designer lighting, pristine finishes, curated stylish decor. IMMACULATE PRESENTATION: spotlessly clean, perfectly organized, minimalist elegance, professional interior design staging. Vibrant yet refined, visually striking, modern aesthetic appeal. Ultra-sharp 8k photography, flawless composition, architectural magazine quality.`,
                negative_prompt: "identical to original, no changes, messy, cluttered, disorganized, chaotic, dirty, dusty, old furniture, dated style, boring, dull, futuristic, neon, sci-fi, blur, noise, artifacts, low quality, grainy",
                steps: 40,
                guidance: 2.5,  // Optimized for clean, modern, eye-catching transformations
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
