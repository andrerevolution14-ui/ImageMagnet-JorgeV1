'use client';

import { motion } from 'framer-motion';
import { Upload, ChevronRight, Sparkles } from 'lucide-react';
import { FunnelData } from './Funnel';
import { useState } from 'react';

interface Step1Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
    onNext: () => void;
}

const styles = ['Moderno', 'Minimalista', 'Rústico'];
const zones = ['Cozinha', 'Sala', 'Quarto', 'Casa de Banho'];

export default function Step1Hook({ data, updateData, onNext }: Step1Props) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                updateData({ image: e.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10"
        >
            {/* Hero Title */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: '#f1f5f9',
                        color: '#2563eb',
                        fontWeight: 700,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: '9999px',
                        marginBottom: '24px',
                        border: '1px solid #e2e8f0'
                    }}
                >
                    ⚡ Visualização IA Gratuita
                </motion.div>
                <motion.h1
                    className="hero-title mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Veja o potencial oculto da sua casa em 30 segundos
                </motion.h1>
                <p className="text-base text-secondary px-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Tecnologia IA profissional ao seu alcance. <span style={{ fontWeight: 600, color: '#1e293b' }}>100% gratuito</span>, sem compromisso.
                </p>
            </div>

            <div className="space-y-6">
                {/* Upload Area */}
                <div
                    className={`glass-card p-6 border-dashed border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center hover:border-primary hover:bg-slate-50 ${isDragging ? 'border-primary bg-slate-100 scale-105' : 'border-slate-200'}`}
                    style={{ minHeight: '280px', background: '#ffffff' }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        handleFile(file);
                    }}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFile(e.target.files?.[0] as File)}
                    />

                    {data.image ? (
                        <div className="relative w-full">
                            <img src={data.image} alt="Upload" className="rounded-xl object-cover w-full" style={{ maxHeight: '280px' }} />
                            <div style={{
                                marginTop: '16px',
                                padding: '12px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                color: '#2563eb',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}>
                                <Sparkles size={18} /> Imagem carregada com sucesso!
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px',
                                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)'
                            }}>
                                <Upload size={36} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Carregue a foto da sua {data.zone}</h3>
                            <p className="text-secondary text-sm">Arraste a imagem ou toque para selecionar</p>
                        </>
                    )}
                </div>

                {/* Selectors Card */}
                <div className="glass-card p-6 space-y-6">
                    <div>
                        <label className="section-label">
                            <Sparkles className="text-primary w-5 h-5" /> O que quer remodelar?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {zones.map((z) => (
                                <button
                                    key={z}
                                    onClick={() => updateData({ zone: z })}
                                    className={`selector-button ${data.zone === z ? 'selector-button-active' : ''}`}
                                >
                                    {z}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="section-label">Escolha o seu Estilo</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {styles.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => updateData({ style: s })}
                                    className={`selector-button ${data.style === s ? 'selector-button-active' : ''}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Button - WITH INLINE GRADIENT */}
                <motion.button
                    onClick={() => {
                        if (!data.image) {
                            alert("Por favor, carregue uma foto primeiro para gerar a visualização!");
                            return;
                        }
                        onNext();
                    }}
                    whileHover={data.image ? { scale: 1.02 } : {}}
                    whileTap={data.image ? { scale: 0.98 } : {}}
                    style={{
                        width: '100%',
                        padding: '20px 32px',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'white',
                        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
                        borderRadius: '16px',
                        border: 'none',
                        cursor: data.image ? 'pointer' : 'not-allowed',
                        opacity: data.image ? 1 : 0.5,
                        boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    ✨ Gerar Minha Nova Casa
                    <ChevronRight size={24} />
                </motion.button>
            </div>
        </motion.div>
    );
}
