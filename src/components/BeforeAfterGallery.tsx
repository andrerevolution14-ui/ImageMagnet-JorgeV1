'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type BeforeAfterItem = {
    id: number;
    before: string;
    after: string;
    title: string;
    style: string;
};

// Placeholder data - você pode substituir com suas próprias imagens
const examples: BeforeAfterItem[] = [
    {
        id: 1,
        before: '/examples/before-1.jpg',
        after: '/examples/after-1.jpg',
        title: 'Sala de Estar',
        style: 'Moderno Luxuoso'
    },
    {
        id: 2,
        before: '/examples/before-2.jpg',
        after: '/examples/after-2.jpg',
        title: 'Cozinha',
        style: 'Minimalista'
    },
    {
        id: 3,
        before: '/examples/before-3.jpg',
        after: '/examples/after-3.jpg',
        title: 'Quarto',
        style: 'Contemporâneo'
    },
    {
        id: 4,
        before: '/examples/before-4.jpg',
        after: '/examples/after-4.jpg',
        title: 'Casa de Banho',
        style: 'Escandinavo'
    }
];

export default function BeforeAfterGallery() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const current = examples[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % examples.length);
        setSliderPosition(50);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
        setSliderPosition(50);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
        setSliderPosition(percent);
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Transformações Reais
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Veja como a IA pode transformar completamente o seu espaço em segundos
                        </p>
                    </motion.div>
                </div>

                {/* Before/After Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Image Container */}
                        <div
                            className="relative aspect-[16/10] select-none cursor-ew-resize"
                            onMouseMove={handleMouseMove}
                            onTouchMove={handleTouchMove}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => setIsDragging(false)}
                            onMouseLeave={() => setIsDragging(false)}
                            onTouchStart={() => setIsDragging(true)}
                            onTouchEnd={() => setIsDragging(false)}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    {/* After Image (Background) */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={current.after}
                                            alt={`Depois - ${current.title}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Before Image (Foreground with clip) */}
                                    <div
                                        className="absolute inset-0"
                                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                    >
                                        <img
                                            src={current.before}
                                            alt={`Antes - ${current.title}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Slider Handle */}
                                    <div
                                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                                        style={{ left: `${sliderPosition}%` }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-100">
                                            <div className="flex gap-1">
                                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                                                <ChevronRight className="w-4 h-4 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Labels */}
                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        Antes
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium">
                                        Depois
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Info Bar */}
                        <div className="p-6 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{current.title}</h3>
                                    <p className="text-gray-600 text-sm">Estilo: {current.style}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrev}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <div className="flex gap-2 px-4">
                                        {examples.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setCurrentIndex(idx);
                                                    setSliderPosition(50);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex
                                                    ? 'bg-blue-600 w-8'
                                                    : 'bg-gray-300 hover:bg-gray-400'
                                                    }`}
                                                aria-label={`Ir para exemplo ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Próximo"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-700" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instruction Hint */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-center text-gray-500 text-sm mt-4"
                    >
                        💡 Arraste o controlo para comparar antes e depois
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
