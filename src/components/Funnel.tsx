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

        // Trigger background generation
        fetch('/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                image: data.image,
                style: data.style,
                zone: data.zone,
            }),
        })
            .then(res => res.json())
            .then(result => {
                console.log("Generation result:", result);
                if (result.output) {
                    updateData({ outputImage: result.output });
                }
            })
            .catch(err => console.error('Generation failed', err));
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
