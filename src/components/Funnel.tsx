'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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

    const pollRef = useRef<NodeJS.Timeout | null>(null);

    const startGeneration = async () => {
        if (!data.image) return;

        const generationStartTime = Date.now();
        console.log("🚀 [FRONTEND] Starting generation process...");
        updateData({ status: 'generating', errorMessage: undefined });

        try {
            // Step 1: Start the prediction
            const apiCallStart = Date.now();
            console.log("📤 [FRONTEND] Calling /api/generate...");

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: data.image,
                    style: data.style,
                    zone: data.zone,
                }),
            });

            const apiCallTime = Date.now() - apiCallStart;
            console.log(`✅ [FRONTEND] API call completed in ${apiCallTime}ms`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.error || errorData.details || response.statusText;
                throw new Error(message || "Erro desconhecido ao iniciar a geração.");
            }

            let prediction = await response.json();

            if (prediction.error) {
                throw new Error(prediction.error);
            }

            console.log("🎯 [FRONTEND] Prediction started:", prediction.id);
            console.log(`⏱️ [FRONTEND] Time to start prediction: ${Date.now() - generationStartTime}ms`);


            // Step 2: Poll for results using adaptive polling (fast at first, then slower)
            let pollCount = 0;
            const maxPolls = 250;

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
                    const statusRes = await fetch(`/api/predictions/${prediction.id}`, {
                        cache: 'no-store' // Prevent caching to always get fresh status
                    });

                    if (!statusRes.ok) {
                        const errorMsg = `Erro ao verificar estado (${statusRes.status})`;
                        console.error(errorMsg);
                        // Optional: only fail after multiple consecutive fetch errors
                        if (pollCount > 10) throw new Error("Falha na comunicação com o servidor após várias tentativas.");
                    } else {
                        const currentStatus = await statusRes.json();
                        console.log("Current status from API:", currentStatus.status);

                        // Log if the prediction is queued or starting
                        if (currentStatus.status === "starting") {
                            console.log("⏳ Model is starting (cold start)...");
                        } else if (currentStatus.status === "processing") {
                            console.log("🔄 Model is processing...");
                        }

                        if (currentStatus.status === "succeeded") {
                            const outputUrl = Array.isArray(currentStatus.output)
                                ? currentStatus.output[currentStatus.output.length - 1]
                                : currentStatus.output;

                            if (outputUrl) {
                                console.log("✅ Success! Image URL received:", outputUrl);
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

                // Adaptive polling interval: fast at first, then slower
                // First 10 polls: 1 second (0-10 seconds)
                // Next 20 polls: 2 seconds (10-50 seconds)
                // After that: 3 seconds
                let nextInterval = 1000; // Default: 1 second
                if (pollCount > 30) {
                    nextInterval = 3000; // 3 seconds after 30 polls
                } else if (pollCount > 10) {
                    nextInterval = 2000; // 2 seconds after 10 polls
                }

                console.log(`⏱️ Next poll in ${nextInterval}ms`);
                pollRef.current = setTimeout(poll, nextInterval);
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
        setStep(2); // Move to transition
    };

    const handleStep2Submit = () => {
        sendLeadToPocketBase(data);
        setStep(4); // Move to final result
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <Step1Hook key="step1" data={data} updateData={updateData} onNext={handleStep1Submit} />
                )}

                {step === 2 && (
                    <TransitionStep key="step2" onComplete={() => setStep(3)} />
                )}

                {step === 3 && (
                    <Step2Quiz key="step3" data={data} updateData={updateData} onNext={handleStep2Submit} />
                )}

                {step === 4 && (
                    <Step3Result key="step4" data={data} updateData={updateData} />
                )}
            </AnimatePresence>
        </div>
    );
}

// Intermediate Loading Step
function TransitionStep({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // Approx 3 seconds total
        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
            <div style={{ marginBottom: '30px' }}>
                <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    border: '4px solid #e2e8f0',
                    borderTopColor: '#2563eb',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                A remodelar a sua casa...
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
                A nossa IA está a analisar o seu espaço e a criar uma visualização única.
            </p>

            <div style={{
                width: '100%',
                height: '8px',
                background: '#f1f5f9',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '10px'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                    transition: 'width 0.1s ease-out'
                }} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>
                {progress}%
            </div>
        </div>
    );
}
