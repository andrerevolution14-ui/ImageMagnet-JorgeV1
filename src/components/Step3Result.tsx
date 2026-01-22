'use client';

import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, RefreshCw, Star, Award, Clock } from 'lucide-react';
import { FunnelData } from './Funnel';

interface Step3Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
}

export default function Step3Result({ data }: Step3Props) {
    const whatsappUrl = "https://wa.link/yn4hvp";

    const openImage = (url: string | null | undefined) => {
        if (url) window.open(url, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                padding: '24px 16px 80px 16px'
            }}
        >
            {/* Success Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}>
                    <CheckCircle2 size={14} />
                    PROJETO CONCLUÍDO
                </div>
            </div>

            <h1 style={{
                fontSize: '28px',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '24px',
                background: 'linear-gradient(135deg, #0f172a, #1e40af, #0f172a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                Sua Nova Casa ✨
            </h1>

            {/* Images Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {/* AFTER Image */}
                <div
                    onClick={() => openImage(data.outputImage)}
                    style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        width: '100%',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)',
                        border: '2px solid white',
                        cursor: 'pointer',
                        background: '#f8fafc'
                    }}
                >
                    {!data.outputImage ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #f1f5f9, #f8fafc)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8'
                        }}>
                            <RefreshCw style={{ animation: 'spin 2s linear infinite', marginBottom: '10px', color: '#3b82f6' }} size={32} />
                            <span style={{ fontWeight: 700, fontSize: '13px' }}>A finalizar visualização...</span>
                            <span style={{ fontSize: '11px', marginTop: '2px', color: '#cbd5e1' }}>Isto demora apenas alguns segundos</span>
                        </div>
                    ) : (
                        <>
                            <img
                                src={data.outputImage}
                                alt="After"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    console.error("Image failed to load:", data.outputImage);
                                    // Could fallback to a message or retry
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 700,
                                boxShadow: '0 4px 10px rgba(34, 197, 94, 0.4)'
                            }}>
                                DEPOIS ✨
                            </div>
                        </>
                    )}
                </div>

                {/* BEFORE Image */}
                <div
                    onClick={() => openImage(data.image)}
                    style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        width: '80%',
                        margin: '0 auto',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        opacity: 0.8
                    }}
                >
                    {data.image && (
                        <>
                            <img src={data.image} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: 700
                            }}>
                                ANTES
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* COMPACT WhatsApp CTA Button */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        width: '100%',
                        padding: '14px 20px',
                        background: 'linear-gradient(135deg, #25D366, #128C7E)',
                        color: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        marginBottom: '10px',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageCircle size={22} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800 }}>Enviar mensagem</div>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Avaliação grátis sem compromisso</div>
                    </div>
                </a>
                <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    maxWidth: '90%',
                    margin: '0 auto',
                    lineHeight: 1.4
                }}>
                    ✨ <span style={{ fontWeight: 600, color: '#475569' }}>Nota:</span> O Jorge ajuda a entender o melhor resultado possível e o seu orçamento.
                </p>
            </div>

            {/* Compact Trust Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                <div style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    borderRadius: '12px',
                    border: '1px solid #fcd34d'
                }}>
                    <Star style={{ width: '20px', height: '20px', color: '#f59e0b', margin: '0 auto 4px', fill: '#f59e0b' }} />
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#92400e' }}>4.9</div>
                    <div style={{ fontSize: '10px', color: '#b45309', fontWeight: 600 }}>Avaliação</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    borderRadius: '12px',
                    border: '1px solid #6ee7b7'
                }}>
                    <Award style={{ width: '20px', height: '20px', color: '#059669', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#065f46' }}>120+</div>
                    <div style={{ fontSize: '10px', color: '#047857', fontWeight: 600 }}>Projetos</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: '12px 8px',
                    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                    borderRadius: '12px',
                    border: '1px solid #93c5fd'
                }}>
                    <Clock style={{ width: '20px', height: '20px', color: '#2563eb', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af' }}>24h</div>
                    <div style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: 600 }}>Resposta</div>
                </div>
            </div>

            {/* Secondary action */}
            <div style={{ textAlign: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <RefreshCw size={12} />
                    Gerar nova visualização
                </button>
            </div>
        </motion.div>
    );
}
