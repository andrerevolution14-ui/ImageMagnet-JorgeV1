'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Clock, Shield } from 'lucide-react';

type HeroProps = {
    onStartClick: () => void;
};

export default function Hero({ onStartClick }: HeroProps) {
    const features = [
        {
            icon: Zap,
            text: 'Transformação em 10 segundos'
        },
        {
            icon: Sparkles,
            text: 'IA de última geração'
        },
        {
            icon: Shield,
            text: '100% gratuito e sem compromisso'
        }
    ];

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"
                />
            </div>

            <div className="max-w-6xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full mb-8"
                >
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                        #1 IA de Remodelação em Aveiro
                    </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                >
                    🔥 Transforme o seu{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        espaço
                    </span>
                    <br />
                    em segundos
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                    Carregue uma foto da sua casa em Aveiro e veja como ficaria com diferentes estilos.
                    <br />
                    <span className="font-semibold text-gray-900">
                        Visualização IA gratuita e sem compromisso.
                    </span>
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-10"
                >
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm"
                        >
                            <feature.icon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <button
                        onClick={onStartClick}
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Começar Agora - Grátis
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    <p className="text-sm text-gray-500 mt-3">
                        ✓ Sem cartão de crédito • ✓ Resultado em 10 segundos
                    </p>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 hidden lg:block">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="text-6xl opacity-20"
                    >
                        🏠
                    </motion.div>
                </div>
                <div className="absolute bottom-20 right-10 hidden lg:block">
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="text-6xl opacity-20"
                    >
                        ✨
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
