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

        // ---------- Prediction using a Professional High-Performance Model ----------
        // Model: black-forest-labs/flux-canny-pro (Fast & High Stability)
        console.log(`[API] Starting prediction for style: ${style}, zone: ${zone}...`);

        const prediction = await replicate.predictions.create({
            model: "black-forest-labs/flux-canny-pro",
            input: {
                control_image: resizedImage,
                prompt: `Stunning ${descriptiveStyle} interior design transformation of this ${zone}. RICH TEXTURES: textured walls with depth, luxurious fabrics, natural wood grains, premium materials. DRAMATIC LIGHTING: layered lighting with ambient, task and accent lights, warm glowing lamps, natural window light, shadows and highlights creating depth. HIGH CONTRAST: bold color palette, striking visual interest, professional color grading. COMPLETE MAKEOVER: brand new ${descriptiveStyle} furniture pieces, statement decor items, plants, artwork, rugs, cushions, curtains. Professional architectural digest photography, ultra-sharp 8k resolution, cinematic composition, magazine cover quality. Preserve original room layout and windows but completely transform the aesthetic.`,
                negative_prompt: "identical to original, unchanged, same furniture, same colors, same style, futuristic, neon, sci-fi, artificial lighting, space-age, plastic, glossy, blur, distorted, moving walls, modifying windows, low resolution, grainy, blurry",
                steps: 35,  // Increased for better texture and detail quality
                guidance: 2.5,  // Lower guidance = more creative freedom for dramatic transformation
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
