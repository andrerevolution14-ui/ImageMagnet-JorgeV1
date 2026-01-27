import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || '',
});

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const predictionId = params.id;

    try {
        console.log(`[PREDICTIONS API] Fetching status for: ${predictionId}`);

        // Force fresh data from Replicate
        const prediction = await replicate.predictions.get(predictionId);

        console.log(`[PREDICTIONS API] Status: ${prediction.status}`);

        if (prediction.error) {
            return NextResponse.json({ error: prediction.error }, { status: 500 });
        }

        // Return with no-cache headers
        return NextResponse.json(prediction, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error: any) {
        console.error('Check prediction error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
