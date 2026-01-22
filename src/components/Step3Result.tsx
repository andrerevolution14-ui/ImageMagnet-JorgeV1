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
                maxWidth: '600px',
                margin: '0 auto',
                padding: '24px 16px 160px 16px'
            }}
        >
            {/* Success Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
                }}>
                    <CheckCircle2 size={16} />
                    PROJETO CONCLUÍDO
                </div>
            </div>

            <h1 style={{
                fontSize: '32px',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '32px',
                background: 'linear-gradient(135deg, #0f172a, #1e40af, #0f172a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                A Sua Nova Casa ✨
            </h1>

            {/* Images Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {/* AFTER Image */}
                <div
                    onClick={() => openImage(data.outputImage)}
                    style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        width: '100%',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        border: '3px solid white',
                        cursor: 'pointer'
                    }}
                >
                    {!data.outputImage ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #dbeafe, #ede9fe, #fce7f3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748b'
                        }}>
                            <RefreshCw style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: '#3b82f6' }} size={36} />
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>A gerar remodelação...</span>
                            <span style={{ fontSize: '12px', marginTop: '4px', color: '#94a3b8' }}>~30 segundos</span>
                        </div>
                    ) : (
                        <>
                            <img src={data.outputImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '9999px',
                                fontSize: '13px',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
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
                        width: '85%',
                        margin: '0 auto',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        border: '2px solid #e2e8f0',
                        cursor: 'pointer',
                        opacity: 0.85
                    }}
                >
                    {data.image && (
                        <>
                            <img src={data.image} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700
                            }}>
                                ANTES
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* WhatsApp CTA Button */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: 'flex',
                        width: '100%',
                        padding: '24px 24px',
                        background: 'linear-gradient(135deg, #25D366, #128C7E)',
                        color: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 10px 40px rgba(37, 211, 102, 0.5)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        textDecoration: 'none',
                        marginBottom: '16px',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1.02)'
                    }}
                >
                    <MessageCircle size={32} />
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800 }}>Enviar mensagem</div>
                        <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: 500 }}>Agendar avaliação grátis sem compromisso</div>
                    </div>
                </a>
                <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    maxWidth: '85%',
                    margin: '0 auto',
                    lineHeight: 1.5
                }}>
                    ✨ <span style={{ fontWeight: 600, color: '#475569' }}>Nota:</span> O Jorge ajuda a entender o melhor resultado possível e o seu orçamento.
                </p>
            </div>

            {/* Trust Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                    textAlign: 'center',
                    padding: '16px 12px',
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    borderRadius: '16px',
                    border: '2px solid #fcd34d'
                }}>
                    <Star style={{ width: '28px', height: '28px', color: '#f59e0b', margin: '0 auto 8px', fill: '#f59e0b' }} />
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#92400e' }}>4.9</div>
                    <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600 }}>Avaliação</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: '16px 12px',
                    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                    borderRadius: '16px',
                    border: '2px solid #6ee7b7'
                }}>
                    <Award style={{ width: '28px', height: '28px', color: '#059669', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#065f46' }}>120+</div>
                    <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>Projetos</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: '16px 12px',
                    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                    borderRadius: '16px',
                    border: '2px solid #93c5fd'
                }}>
                    <Clock style={{ width: '28px', height: '28px', color: '#2563eb', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e40af' }}>24h</div>
                    <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>Resposta</div>
                </div>
            </div>

            {/* Secondary action */}
            <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#64748b',
                        fontSize: '14px',
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <RefreshCw size={14} />
                    Gerar nova visualização
                </button>
            </div>

        </motion.div>
    );
}
