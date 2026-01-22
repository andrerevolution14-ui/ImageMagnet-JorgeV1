import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, question_1, question_2 } = body;

        console.log("Saving lead to PocketBase via Server API:", email);

        const response = await fetch('http://76.13.11.36:8090/api/collections/leads/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                question_1,
                question_2
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("PocketBase error response:", errorText);
            return NextResponse.json({ error: "Failed to save to PocketBase" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Lead capture API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
