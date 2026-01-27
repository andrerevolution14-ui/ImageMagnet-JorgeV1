'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CheckCircle2, RefreshCw, Star, Award, Clock } from 'lucide-react';
import { FunnelData } from './Funnel';

interface Step3Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
}

import { event } from './FacebookPixel';

export default function Step3Result({ data }: Step3Props) {
    const whatsappUrl = "https://wa.link/yn4hvp";
    const [seconds, setSeconds] = useState(0);

    const handleWhatsAppClick = () => {
        // Track as High Lead with a high value for optimization
        event('Lead', {
            content_name: 'Mensagem ao Jorge',
            content_category: 'Conversion',
            value: 50.00,
            currency: 'EUR'
        });
        // Also fire a custom event as requested
        event('HighLead', {
            content_name: 'Mensagem ao Jorge',
            value: 50.00,
            currency: 'EUR'
        });
    };

    // Track time to show helpful messages if it takes too long
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!data.outputImage && data.status !== 'error') {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [data.outputImage, data.status]);

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
                    background: '#f0fdf4',
                    color: '#16a34a',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid #bbf7d0'
                }}>
                    <CheckCircle2 size={14} />
                    PROJETO CONCLUÍDO
                </div>
            </div>

            <h1 style={{
                fontSize: '28px',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #0f172a, #1e40af, #0f172a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                O potencial da sua casa ✨
            </h1>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Veja como o Jorge pode transformar o seu espaço em Aveiro.
            </p>

            {/* Images Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {/* AFTER Image or Error/Loading */}
                <div
                    onClick={() => data.outputImage && openImage(data.outputImage)}
                    style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        width: '100%',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: data.status === 'error' ? 'none' : '0 15px 30px rgba(0, 0, 0, 0.12)',
                        border: data.status === 'error' ? '2px solid #fee2e2' : '2px solid white',
                        cursor: data.outputImage ? 'pointer' : 'default',
                        background: data.status === 'error' ? '#fef2f2' : '#f8fafc'
                    }}
                >
                    {data.status === 'error' ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px',
                            textAlign: 'center'
                        }}>
                            <div style={{ color: '#ef4444', marginBottom: '12px', fontWeight: 700 }}>⚠️ Oops!</div>
                            <div style={{ fontSize: '12px', color: '#991b1b', lineHeight: 1.4, marginBottom: '16px' }}>
                                {data.errorMessage || "Ocorreu um erro ao gerar a sua imagem. Por favor, tente novamente."}
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    padding: '8px 16px',
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                Tentar de Novo
                            </button>
                        </div>
                    ) : !data.outputImage ? (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #f1f5f9, #f8fafc)',
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94a3b8',
                            textAlign: 'center'
                        }}>
                            <RefreshCw style={{ animation: 'spin 2s linear infinite', marginBottom: '16px', color: '#3b82f6' }} size={40} />
                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#1e293b', marginBottom: '4px' }}>
                                {seconds < 15 ? "A analisar o potencial do seu espaço..." :
                                    seconds < 35 ? "A IA está a aplicar novos materiais e luz..." :
                                        "Quase pronto! A finalizar os detalhes..."}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b', maxWidth: '80%' }}>
                                {seconds < 15 ? "Isto demora apenas alguns segundos" :
                                    seconds < 35 ? "Estamos a definir a melhor visão para a sua casa..." :
                                        "A IA está a dar o toque final de realismo."}
                            </span>

                            {/* Visual Progress Indicator */}
                            <div style={{
                                width: '60%',
                                height: '4px',
                                background: '#e2e8f0',
                                borderRadius: '2px',
                                marginTop: '20px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <motion.div
                                    animate={{
                                        left: ['-100%', '100%']
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    style={{
                                        position: 'absolute',
                                        width: '50%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <img
                                src={data.outputImage}
                                alt="After"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    console.error("Image failed to load:", data.outputImage);
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
                    onClick={handleWhatsAppClick}
                    style={{
                        display: 'flex',
                        width: '100%',
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        color: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        textDecoration: 'none',
                        marginBottom: '10px',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.2)';
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: '#25D366',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <MessageCircle size={24} fill="white" />
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, lineHeight: 1.2 }}>Validar esta ideia com o Jorge</div>
                        <div style={{ fontSize: '11px', opacity: 0.8 }}>Conversa grátis • Sem compromisso</div>
                    </div>
                </a>
                <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    maxWidth: '90%',
                    margin: '12px auto 0',
                    lineHeight: 1.4
                }}>
                    🔒 <span style={{ fontWeight: 600, color: '#475569' }}>Clareza total:</span> O Jorge ajuda-o a perceber custos e prazos para tornar esta visão real, sem pressões.
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
