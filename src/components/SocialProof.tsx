'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

type Testimonial = {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    avatar?: string;
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Maria Silva',
        role: 'Proprietária em Aveiro',
        content: 'Incrível! Consegui visualizar como a minha sala ficaria renovada antes de gastar um cêntimo. Poupei tempo e dinheiro.',
        rating: 5
    },
    {
        id: 2,
        name: 'João Costa',
        role: 'Arquiteto',
        content: 'Uso esta ferramenta para mostrar aos meus clientes diferentes possibilidades. A qualidade das transformações é impressionante.',
        rating: 5
    },
    {
        id: 3,
        name: 'Ana Rodrigues',
        role: 'Designer de Interiores',
        content: 'Revolucionou a forma como apresento projetos. Os clientes adoram ver as opções em segundos.',
        rating: 5
    }
];

// Logos de empresas fictícias ou reais que usam o serviço
const trustedBy = [
    { name: 'Aveiro Imóveis', logo: '🏢' },
    { name: 'Casa & Design', logo: '🏠' },
    { name: 'Renovar PT', logo: '🔨' },
    { name: 'Espaço Ideal', logo: '✨' },
    { name: 'Habitat Premium', logo: '🌟' }
];

export default function SocialProof() {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Trusted By Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
                        Confiado por profissionais em Aveiro
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {trustedBy.map((company, idx) => (
                            <motion.div
                                key={company.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-3xl">{company.logo}</span>
                                <span className="font-semibold text-gray-700 text-sm">{company.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Testimonials Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        O que dizem os nossos clientes
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Centenas de pessoas em Aveiro já transformaram os seus espaços
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Quote Icon */}
                            <div className="mb-4">
                                <Quote className="w-8 h-8 text-blue-600 opacity-50" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: '500+', label: 'Transformações' },
                        { value: '98%', label: 'Satisfação' },
                        { value: '10s', label: 'Tempo Médio' },
                        { value: '24/7', label: 'Disponível' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl"
                        >
                            <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </p>
                            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
