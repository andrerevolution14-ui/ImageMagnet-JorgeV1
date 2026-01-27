'use client';

import { useState, useCallback, useRef } from 'react';
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
    whatsapp: string;
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
        whatsapp: '',
        outputImage: null,
        status: 'idle'
    });

    const nextStep = useCallback(() => setStep((s) => s + 1), []);

    const sendLeadToPocketBase = async (finalData: FunnelData) => {
        try {
            console.log("Sending lead to backend API with data:", {
                whatsapp: finalData.whatsapp,
                q1: finalData.question_1,
                q2: finalData.question_2
            });
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    whatsapp: finalData.whatsapp,
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

    const pollRef = useRef<NodeJS.Timeout | null>(null);

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

            // Step 2: Poll for results using a robust recursive timeout
            let pollCount = 0;
            const maxPolls = 250; // Increased to allow more time for slow model starts

            const poll = async () => {
                if (!prediction.id || pollCount >= maxPolls) {
                    if (pollCount >= maxPolls) {
                        updateData({ status: 'error', errorMessage: "O tempo limite foi atingido. Por favor, tente novamente." });
                    }
                    return;
                }

                pollCount++;
                console.log(`Polling count: ${pollCount}, ID: ${prediction.id}`);

                try {
                    const statusRes = await fetch(`/api/predictions/${prediction.id}`);

                    if (!statusRes.ok) {
                        const errorMsg = `Erro ao verificar estado (${statusRes.status})`;
                        console.error(errorMsg);
                        // Optional: only fail after multiple consecutive fetch errors
                        if (pollCount > 10) throw new Error("Falha na comunicação com o servidor após várias tentativas.");
                    } else {
                        const currentStatus = await statusRes.json();
                        console.log("Current status from API:", currentStatus.status);

                        if (currentStatus.status === "succeeded") {
                            const outputUrl = Array.isArray(currentStatus.output)
                                ? currentStatus.output[currentStatus.output.length - 1] // Get the last one, sometimes there's a progression
                                : currentStatus.output;

                            if (outputUrl) {
                                console.log("Success! Image URL received:", outputUrl);
                                updateData({ outputImage: outputUrl, status: 'success' });
                                return; // Stop polling
                            } else {
                                throw new Error("A IA terminou mas não gerou uma imagem válida.");
                            }
                        } else if (currentStatus.status === "failed" || currentStatus.status === "canceled") {
                            const errorDetail = currentStatus.error || "Erro desconhecido na geração.";
                            updateData({ status: 'error', errorMessage: `A IA encontrou um problema: ${errorDetail}` });
                            console.error("Task failed or canceled:", errorDetail);
                            return; // Stop polling
                        }
                    }
                } catch (statusErr: any) {
                    console.error("Polling error caught:", statusErr);
                    updateData({ status: 'error', errorMessage: statusErr.message || "Erro ao processar imagem." });
                    return; // Stop polling on hard error
                }

                // Schedule next poll if still generating
                pollRef.current = setTimeout(poll, 2500); // Slightly more relaxed interval
            };

            // Start polling
            poll();

            // Safety timeout: stop after 8 minutes (increased from 5 to accommodate queuing/cold starts)
            setTimeout(() => {
                setData(prev => {
                    // Check if we are still generating and don't have an image after 8 mins
                    if (prev.status === 'generating' && !prev.outputImage) {
                        if (pollRef.current) clearTimeout(pollRef.current as NodeJS.Timeout);
                        return { ...prev, status: 'error', errorMessage: "O servidor está a demorar mais do que o esperado devido a alta procura. Por favor, tente novamente dentro de momentos." };
                    }
                    return prev;
                });
            }, 650000);

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
