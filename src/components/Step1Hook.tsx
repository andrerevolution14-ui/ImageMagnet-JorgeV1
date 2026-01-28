'use client';

import { motion } from 'framer-motion';
import { Upload, ChevronRight, Sparkles, Shield } from 'lucide-react';
import { FunnelData } from './Funnel';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';

interface Step1Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
    onNext: () => void;
}

const styles = ['Moderno', 'Minimalista', 'Rústico'];
const zones = ['Cozinha', 'Sala', 'Quarto', 'Casa de Banho'];

export default function Step1Hook({ data, updateData, onNext }: Step1Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleFile = async (file: File) => {
        if (file && file.type.startsWith('image/')) {
            setIsCompressing(true);
            try {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1280,
                    useWebWorker: true
                };

                const compressedFile = await imageCompression(file, options);
                const reader = new FileReader();
                reader.onload = (e) => {
                    updateData({ image: e.target?.result as string });
                    setIsCompressing(false);
                };
                reader.readAsDataURL(compressedFile);
            } catch (error) {
                console.error("Compression failed:", error);
                setIsCompressing(false);
                // Fallback to original
                const reader = new FileReader();
                reader.onload = (e) => updateData({ image: e.target?.result as string });
                reader.readAsDataURL(file);
            }
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
                    📍Aveiro • Visualização IA Gratuita
                </motion.div>
                <motion.h1
                    className="hero-title mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Carregue uma foto da sua casa
                </motion.h1>
                <p className="text-base text-secondary px-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Veja como o seu espaço pode ficar transformado pela IA. <span style={{ fontWeight: 600, color: '#1e293b' }}>Grátis e em 10 segundos</span>.
                </p>

                {/* Privacy Reassurance */}
                <div style={{
                    maxWidth: '600px',
                    margin: '24px auto 0',
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #f0f9ff, #f8fafc)',
                    border: '1px solid #bfdbfe',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Shield style={{ color: '#2563eb', flexShrink: 0 }} size={24} />
                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, textAlign: 'left' }}>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>A sua privacidade é importante.</span> As suas fotos são processadas de forma segura e nunca serão partilhadas ou usadas para outros fins.
                    </div>
                </div>
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
                            <h3 className="text-xl font-bold mb-2">Carregue uma foto do seu espaço</h3>
                            <p className="text-secondary text-sm">Qualquer foto serve - pode ser do telemóvel</p>
                        </>
                    )}
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
                    ✨ Transformar Agora
                    <ChevronRight size={24} />
                </motion.button>

                {/* Small Before/After Examples - Below Button */}
                <div style={{ marginTop: '20px' }}>
                    <p style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#64748b',
                        marginBottom: '12px',
                        textAlign: 'center'
                    }}>
                        ✨ Exemplos de transformações
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px'
                    }}>
                        {[1, 2].map((i) => (
                            <div key={i} style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb',
                                background: '#fff'
                            }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={`/examples/before-${i}.jpg`}
                                            alt="Antes"
                                            style={{
                                                width: '100%',
                                                height: '80px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '4px',
                                            left: '4px',
                                            padding: '2px 6px',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '4px',
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            color: '#475569'
                                        }}>
                                            Antes
                                        </div>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={`/examples/after-${i}.jpg`}
                                            alt="Depois"
                                            style={{
                                                width: '100%',
                                                height: '80px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            padding: '2px 6px',
                                            background: '#2563eb',
                                            borderRadius: '4px',
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            color: '#fff'
                                        }}>
                                            Depois
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
