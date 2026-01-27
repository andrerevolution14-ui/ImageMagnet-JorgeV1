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

        // Enhanced style descriptions for more intelligent AI transformations
        const stylePrompts: Record<string, string> = {
            'Moderno': 'ultra-modern luxury design with sleek contemporary finishes, designer furniture, statement lighting fixtures, premium natural materials like marble and wood, floor-to-ceiling windows, neutral color palette with bold accents, high-end appliances, minimalist elegance',
            'Minimalista': 'sophisticated minimalist design with clean geometric lines, monochromatic color scheme, hidden storage solutions, premium quality materials, abundant natural light, carefully curated furniture pieces, uncluttered spaces, zen-like atmosphere, subtle textures',
            'Rústico': 'warm rustic charm with exposed wooden beams, natural stone features, vintage-inspired fixtures, earthy color palette, handcrafted furniture, cozy textiles, ambient lighting, authentic materials, lived-in elegance, artisanal details'
        };

        // Map zones to English for the AI
        const zoneMap: Record<string, string> = {
            'Cozinha': 'kitchen',
            'Sala': 'living room',
            'Quarto': 'bedroom',
            'Casa de Banho': 'bathroom'
        };

        const styleDescription = stylePrompts[style] || 'professional interior design with premium materials and sophisticated lighting';
        const descriptiveZone = zoneMap[zone] || zone;

        // Helper to resize a base64 image to max 1024px width (preserving aspect ratio)
        const resizeBase64Image = async (base64: string): Promise<string> => {
            const matches = base64.match(/^data:(image\/\w+);base64,(.*)$/);
            const data = matches ? matches[2] : base64;
            const buffer = Buffer.from(data, 'base64');
            const resized = await sharp(buffer)
                .resize({ width: 1024, withoutEnlargement: true })
                .toFormat('jpeg', { quality: 85 })
                .toBuffer();
            return `data:image/jpeg;base64,${resized.toString('base64')}`;
        };

        // --- Preprocess input image (resize to 1024px max for faster upload and processing) ---
        console.log("[API] Resizing image...");
        const resizedImage = await resizeBase64Image(image);
        console.log("[API] Image resized. Length:", resizedImage.length);

        console.log(`[API] Starting prediction for style: ${style}, zone: ${descriptiveZone}...`);

        const prediction = await replicate.predictions.create({
            model: "black-forest-labs/flux-depth-pro",
            input: {
                control_image: resizedImage,
                prompt: `Professional architectural photography of a completely renovated ${descriptiveZone} featuring ${styleDescription}. Transform this space with dramatic improvements: new flooring, updated walls, modern ceiling design, professional interior styling. Magazine-quality result, 8k resolution, photorealistic, expertly lit, award-winning interior design.`,
                steps: 30, // Higher steps for better quality and more intelligent improvements
                guidance: 4.0, // Increased guidance for stronger, more dramatic transformations
                output_format: "jpg",
                safety_tolerance: 2
            },
        });

        console.log('[API] Prediction created successfully:', prediction.id);
        console.log('[API] Prediction status:', prediction.status);

        return NextResponse.json(prediction);
    } catch (error: any) {
        console.error('Final attempt error:', error);
        console.error('Error details:', {
            message: error.message,
            status: error.status,
            response: error.response
        });

        // Check for specific Replicate API errors
        let userMessage = "Erro na IA: " + (error.message || 'Falha ao iniciar geração');

        if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
            userMessage = "O serviço está temporariamente ocupado. Por favor, aguarde alguns segundos e tente novamente.";
        } else if (error.message?.includes('timeout')) {
            userMessage = "O servidor demorou muito a responder. Por favor, tente novamente.";
        }

        return NextResponse.json({
            error: userMessage,
            details: error.toString()
        }, { status: 500 });
    }
}
