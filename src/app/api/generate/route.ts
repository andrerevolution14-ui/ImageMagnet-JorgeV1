import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

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

        // Using FLUX Fill Dev - Optimized for balanced speed and quality
        // Model: black-forest-labs/flux-fill-dev
        // --- Preprocess input image (resize to 1024px max) ---
        const resizedImage = image; // TODO: implement resizing with Sharp or similar library

        // --- Generate ControlNet maps (Depth & Canny) ---
        // Placeholder implementations – replace with actual depth/canny generation logic
        const generateDepthMap = async (img: string) => img; // TODO: integrate a depth estimation model
        const generateCannyMap = async (img: string) => img; // TODO: integrate a Canny edge detection model
        const depthMap = await generateDepthMap(resizedImage);
        const cannyMap = await generateCannyMap(resizedImage);

        // --- Build prompt based on style/zone ---
        const prompt = `A stunning ${zone} interior completely renovated in ${style} style. Professional architectural photography with magazine-quality composition. Features: premium ${style} furniture, designer lighting fixtures, high-end finishes, perfect color coordination. Ultra-realistic, 8K resolution, sharp focus, natural daylight, award-winning interior design, photorealistic rendering, architectural digest quality.`;

        // --- Use Flux ControlNet interior redesign model ---
        const prediction = await replicate.predictions.create({
            // Model identifier – using latest version of lucataco/flux-dev-controlnet-interior-redesign
            version: "latest",
            input: {
                image: resizedImage,
                depth: depthMap,
                canny: cannyMap,
                prompt: prompt,
                prompt_strength: 0.8,
                num_inference_steps: 24, // within 20‑28 range for speed/quality balance
                guidance_scale: 3.5,
                output_format: "jpg",
                output_quality: 95,
                disable_safety_checker: false
            }
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
