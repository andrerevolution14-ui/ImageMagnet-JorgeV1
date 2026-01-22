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
    name: string;
    email: string;
    outputImage: string | null;
};

export default function Funnel() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<FunnelData>({
        image: null,
        style: 'Moderno',
        zone: 'Sala',
        remodelDate: '',
        objective: '',
        name: '',
        email: '',
        outputImage: null,
    });

    const nextStep = useCallback(() => setStep((s) => s + 1), []);

    // Using useCallback to prevent unnecessary re-renders of child components
    const updateData = useCallback((newData: Partial<FunnelData>) => {
        setData((prev) => ({ ...prev, ...newData }));
    }, []);

    const startGeneration = async () => {
        if (!data.image) return;

        console.log("Starting generation process...");

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
                throw new Error(`Failed to start generation: ${response.statusText}`);
            }

            let prediction = await response.json();
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

                        updateData({ outputImage: outputUrl });
                    } else if (currentStatus.status === "failed" || currentStatus.status === "canceled") {
                        clearInterval(pollInterval);
                        console.error("Task failed or canceled", currentStatus.error);
                    }
                } catch (statusErr) {
                    console.error("Polling error:", statusErr);
                    clearInterval(pollInterval);
                }
            }, 1500); // Check every 1.5 seconds

        } catch (err) {
            console.error('Generation failed in frontend:', err);
        }
    };

    const handleStep1Submit = () => {
        startGeneration();
        nextStep();
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {step === 1 && (
                <Step1Hook data={data} updateData={updateData} onNext={handleStep1Submit} />
            )}
            {step === 2 && (
                <Step2Quiz data={data} updateData={updateData} onNext={nextStep} />
            )}
            {step === 3 && (
                <Step3Result data={data} updateData={updateData} />
            )}
        </div>
    );
}
