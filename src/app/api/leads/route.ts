import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, question_1, question_2 } = body;

        console.log("Saving lead to PocketBase. Payload:", { email, question_1, question_2 });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
            const response = await fetch('http://76.13.11.36:8090/api/collections/leads/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, question_1, question_2 }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`PocketBase Error [${response.status}]:`, errorText);
                return NextResponse.json({ error: "PocketBase rejection", details: errorText }, { status: response.status });
            }

            const data = await response.json();
            console.log("PocketBase Success. Record ID:", data.id);
            return NextResponse.json({ success: true, id: data.id });
        } catch (err: any) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                console.error("PocketBase Timeout: VPS at 76.13.11.36 is unreachable or slow.");
                return NextResponse.json({ error: "VPS Connection Timeout" }, { status: 504 });
            }
            throw err;
        }
    } catch (error: any) {
        console.error("Lead capture API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
