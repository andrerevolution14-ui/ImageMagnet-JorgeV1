'use client';

import { Shield } from 'lucide-react';
import { FunnelData } from './Funnel';
import { useState } from 'react';
import { event } from './FacebookPixel';

interface Step2Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
    onNext: () => void;
}

export default function Step2Quiz({ data, updateData, onNext }: Step2Props) {
    const [currentSubStep, setCurrentSubStep] = useState(1);
    const [emailError, setEmailError] = useState<string | null>(null);

    const DISPOSABLE_DOMAINS = [
        'temp-mail.org', '10minutemail.com', 'guerillamail.com', 'mailinator.com',
        'yopmail.com', 'throwawaymail.com', 'guerrillamail.net', 'sharklasers.com',
        'tmail.ws', 'tempmail.com', 'getnada.com', 'dispostable.com', 'temp-mail.ru',
        'dropmail.me', 'anonymousemail.me', 'crazymailing.com', 'maildrop.cc'
    ];

    const validateEmail = (email: string) => {
        if (!email) {
            setEmailError(null);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Por favor, introduza um email válido.");
            return false;
        }

        const domain = email.split('@')[1]?.toLowerCase();
        if (DISPOSABLE_DOMAINS.includes(domain)) {
            setEmailError("Emails temporários não são permitidos.");
            return false;
        }

        setEmailError(null);
        return true;
    };

    const handleNextSubStep = () => {
        if (currentSubStep < 3) {
            setCurrentSubStep(currentSubStep + 1);
        } else {
            // Track completion of the form with a base value
            event('Lead', {
                content_name: 'Formulário Completo',
                content_category: 'Conversion',
                value: 5.00,
                currency: 'EUR'
            });
            onNext();
        }
    };

    const handleOptionClick = (field: Partial<FunnelData>) => {
        updateData(field);
        handleNextSubStep();
    };

    const options1 = [
        { id: 'a', text: 'Vivo na casa e quero renovar', emoji: '🏡', color: '#3b82f6' },
        { id: 'b', text: 'Quero valorizar para vender/arrendar', emoji: '📈', color: '#10b981' },
        { id: 'c', text: 'Estou a comprar e quero ver potencial', emoji: '🔑', color: '#a855f7' }
    ];

    const options2 = [
        { id: 'a', text: 'O mais breve possível', emoji: '⚡', color: '#f97316' },
        { id: 'b', text: 'Nos próximos 3-6 meses', emoji: '📅', color: '#3b82f6' },
        { id: 'c', text: 'Apenas a planear para o futuro', emoji: '💭', color: '#8b5cf6' }
    ];

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '48px 16px', position: 'relative', zIndex: 20 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span style={{
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
                }}>
                    Questão {currentSubStep} de 3
                </span>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.2,
                    padding: '0 16px'
                }}>
                    {currentSubStep === 1 && "Qual o seu perfil de proprietário?"}
                    {currentSubStep === 2 && "Para quando planeia a intervenção?"}
                    {currentSubStep === 3 && "Onde podemos enviar o projeto completo?"}
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <>
                    {currentSubStep === 1 && options1.map((opt) => (
                        <button
                            key={opt.text}
                            type="button"
                            onClick={() => handleOptionClick({ objective: opt.text, question_1: opt.id })}
                            style={{
                                width: '100%',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                background: `linear-gradient(135deg, ${opt.color}15, ${opt.color}08)`,
                                border: `2px solid ${opt.color}30`,
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.borderColor = opt.color;
                                e.currentTarget.style.boxShadow = `0 8px 25px ${opt.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = `${opt.color}30`;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '32px' }}>{opt.emoji}</span>
                            <span style={{ flex: 1, fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>{opt.text}</span>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: opt.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '18px'
                            }}>→</div>
                        </button>
                    ))}

                    {currentSubStep === 2 && options2.map((opt) => (
                        <button
                            key={opt.text}
                            type="button"
                            onClick={() => handleOptionClick({ remodelDate: opt.text, question_2: opt.id })}
                            style={{
                                width: '100%',
                                padding: '20px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                background: `linear-gradient(135deg, ${opt.color}15, ${opt.color}08)`,
                                border: `2px solid ${opt.color}30`,
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'left'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.borderColor = opt.color;
                                e.currentTarget.style.boxShadow = `0 8px 25px ${opt.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = `${opt.color}30`;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '32px' }}>{opt.emoji}</span>
                            <span style={{ flex: 1, fontSize: '18px', fontWeight: 600, color: '#1e293b' }}>{opt.text}</span>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: opt.color,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '18px'
                            }}>→</div>
                        </button>
                    ))}

                    {currentSubStep === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        left: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span>🇵🇹</span>
                                        <span>+351</span>
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="9xx xxx xxx"
                                        value={data.whatsapp}
                                        onChange={(e) => {
                                            // Remove non-digits
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                            updateData({ whatsapp: val });

                                            if (val.length > 0 && val[0] !== '9') {
                                                setEmailError("Deve começar por 9");
                                            } else if (val.length > 0 && val.length < 9) {
                                                setEmailError("Introduza os 9 dígitos");
                                            } else {
                                                setEmailError(null);
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            height: '64px',
                                            paddingLeft: '85px',
                                            paddingRight: '24px',
                                            background: 'white',
                                            border: `2px solid ${emailError ? '#ef4444' : '#e2e8f0'}`,
                                            borderRadius: '16px',
                                            fontSize: '18px',
                                            fontWeight: 500,
                                            color: '#0f172a',
                                            outline: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = emailError ? '#ef4444' : '#3b82f6';
                                            e.currentTarget.style.boxShadow = emailError ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = emailError ? '#ef4444' : '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            {emailError && (
                                <div style={{
                                    color: '#ef4444',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    paddingLeft: '4px',
                                    marginTop: '-8px'
                                }}>
                                    ⚠️ {emailError}
                                </div>
                            )}

                            {/* Privacy explanation - THE EXCUSE */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '16px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px'
                            }}>
                                <Shield style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} size={20} />
                                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>O seu WhatsApp será usado apenas para enviar o projeto</span> e garantir que não existem gerações duplicadas pelo mesmo utilizador.
                                    <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>🔒 Os seus dados estão seguros. Não fazemos chamadas indesejadas nem spam.</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={!!emailError || !data.whatsapp}
                                onClick={handleNextSubStep}
                                style={{
                                    width: '100%',
                                    height: '64px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    color: 'white',
                                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
                                    boxShadow: (emailError || !data.whatsapp) ? 'none' : '0 10px 30px rgba(37, 99, 235, 0.4)',
                                    cursor: (emailError || !data.whatsapp) ? 'not-allowed' : 'pointer',
                                    opacity: (emailError || !data.whatsapp) ? 0.5 : 1,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {emailError ? 'Número Inválido' : (data.whatsapp ? '✨ Ver Meu Projeto' : 'Introduza o WhatsApp')}
                            </button>
                        </div>
                    )}
                </>
            </div>
        </div>
    );
}
