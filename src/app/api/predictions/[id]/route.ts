import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const predictionId = params.id;

    try {
        const prediction = await replicate.predictions.get(predictionId);

        if (prediction.error) {
            return NextResponse.json({ error: prediction.error }, { status: 500 });
        }

        return NextResponse.json(prediction);
    } catch (error: any) {
        console.error('Check prediction error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
