'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Step1Hook from './Step1Hook';
import Step2Quiz from './Step2Quiz';
import Step3Result from './Step3Result';

export type FunnelData = {
    image: string | null;
    style: string;
    zone: string;
    remodelDate: string;
    objective: string;
    question_1: string;
    question_2: string;
    name: string;
    email: string;
    outputImage: string | null;
    status: 'idle' | 'generating' | 'success' | 'error';
    errorMessage?: string;
};

export default function Funnel() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<FunnelData>({
        image: null,
        style: 'modern luxury',
        zone: 'living room',
        remodelDate: '',
        objective: '',
        question_1: '',
        question_2: '',
        name: '',
        email: '',
        outputImage: null,
        status: 'idle'
    });

    const nextStep = useCallback(() => setStep((s) => s + 1), []);

    const sendLeadToPocketBase = async (finalData: FunnelData) => {
        try {
            console.log("Sending lead to backend API with data:", {
                email: finalData.email,
                q1: finalData.question_1,
                q2: finalData.question_2
            });
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: finalData.email,
                    question_1: finalData.question_1,
                    question_2: finalData.question_2
                }),
            });

            if (response.ok) {
                console.log("Lead captured successfully in PocketBase (via backend)");
            } else {
                console.error("Failed to capture lead via backend API");
            }
        } catch (error) {
            console.error("Error sending lead to backend:", error);
        }
    };

    // Using useCallback to prevent unnecessary re-renders of child components
    const updateData = useCallback((newData: Partial<FunnelData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    }, []);

    const startGeneration = async () => {
        if (!data.image) return;

        console.log("Starting generation process...");
        updateData({ status: 'generating', errorMessage: undefined });

        try {
            // Step 1: Start the prediction
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: data.image,
                    style: data.style,
                    zone: data.zone,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.error || errorData.details || response.statusText;
                throw new Error(message || "Erro desconhecido ao iniciar a geração.");
            }

            let prediction = await response.json();

            if (prediction.error) {
                throw new Error(prediction.error);
            }

            console.log("Prediction started:", prediction.id);

            // Step 2: Poll for results
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/predictions/${prediction.id}`);
                    if (!statusRes.ok) throw new Error("Status check failed");

                    const currentStatus = await statusRes.json();
                    console.log("Current status:", currentStatus.status);

                    if (currentStatus.status === "succeeded") {
                        clearInterval(pollInterval);
                        const outputUrl = Array.isArray(currentStatus.output)
                            ? currentStatus.output[0]
                            : currentStatus.output;

                        updateData({ outputImage: outputUrl, status: 'success' });
                    } else if (currentStatus.status === "failed" || currentStatus.status === "canceled") {
                        clearInterval(pollInterval);
                        updateData({ status: 'error', errorMessage: "A IA encontrou um problema ao processar a imagem. Tente uma foto diferente." });
                        console.error("Task failed or canceled", currentStatus.error);
                    }
                } catch (statusErr) {
                    console.error("Polling error:", statusErr);
                    // Don't stop polling on single network error, but we could add a counter
                }
            }, 2000); // Poll every 2 seconds

            // Safety timeout: stop after 90 seconds
            setTimeout(() => {
                clearInterval(pollInterval);
                if (data.status === 'generating') {
                    updateData({ status: 'error', errorMessage: "Tempo de espera excedido. Tente novamente." });
                }
            }, 90000);

        } catch (err: any) {
            console.error('Generation failed:', err);
            updateData({ status: 'error', errorMessage: err.message });
        }
    };

    const handleStep1Submit = () => {
        startGeneration();
        nextStep();
    };

    const handleStep2Submit = () => {
        sendLeadToPocketBase(data);
        nextStep();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {step === 1 && (
                <Step1Hook data={data} updateData={updateData} onNext={handleStep1Submit} />
            )}
            {step === 2 && (
                <Step2Quiz data={data} updateData={updateData} onNext={handleStep2Submit} />
            )}
            {step === 3 && (
                <Step3Result data={data} updateData={updateData} />
            )}
        </div>
    );
}
