'use client';

import { Shield } from 'lucide-react';
import { FunnelData } from './Funnel';
import { useState } from 'react';

interface Step2Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
    onNext: () => void;
}

export default function Step2Quiz({ data, updateData, onNext }: Step2Props) {
    const [currentSubStep, setCurrentSubStep] = useState(1);

    const handleNextSubStep = () => {
        if (currentSubStep < 3) {
            setCurrentSubStep(currentSubStep + 1);
        } else {
            onNext();
        }
    };

    const handleOptionClick = (field: Partial<FunnelData>) => {
        updateData(field);
        handleNextSubStep();
    };

    const options1 = [
        { text: 'O mais rápido possível', emoji: '⚡', color: '#f97316' },
        { text: 'Daqui a 1-3 meses', emoji: '📅', color: '#3b82f6' },
        { text: 'Apenas a planear', emoji: '💭', color: '#a855f7' }
    ];

    const options2 = [
        { text: 'Valorizar o imóvel (Venda)', emoji: '💎', color: '#10b981' },
        { text: 'Conforto da família', emoji: '🏡', color: '#f59e0b' },
        { text: 'Modernização estética', emoji: '✨', color: '#8b5cf6' }
    ];

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '48px 16px', position: 'relative', zIndex: 20 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderRadius: '9999px',
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
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
                    {currentSubStep === 1 && "Quando pensas tornar isto realidade?"}
                    {currentSubStep === 2 && "Qual o seu principal objetivo?"}
                    {currentSubStep === 3 && "Onde enviamos o seu projeto em HD?"}
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {currentSubStep === 1 && options1.map((opt) => (
                    <button
                        key={opt.text}
                        type="button"
                        onClick={() => handleOptionClick({ remodelDate: opt.text })}
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
                        onClick={() => handleOptionClick({ objective: opt.text })}
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
                                <span style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '24px'
                                }}>👤</span>
                                <input
                                    type="text"
                                    placeholder="O seu Nome"
                                    value={data.name}
                                    onChange={(e) => updateData({ name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        height: '64px',
                                        paddingLeft: '56px',
                                        paddingRight: '24px',
                                        background: 'white',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '16px',
                                        fontSize: '18px',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '24px'
                                }}>📧</span>
                                <input
                                    type="email"
                                    placeholder="O seu Email"
                                    value={data.email}
                                    onChange={(e) => updateData({ email: e.target.value })}
                                    style={{
                                        width: '100%',
                                        height: '64px',
                                        paddingLeft: '56px',
                                        paddingRight: '24px',
                                        background: 'white',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '16px',
                                        fontSize: '18px',
                                        fontWeight: 500,
                                        color: '#0f172a',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Privacy explanation */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                padding: '16px',
                                background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                                border: '2px solid #bfdbfe',
                                borderRadius: '12px'
                            }}>
                                <Shield style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} size={20} />
                                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>O seu email é apenas para enviar o projeto.</span> Utilizamos para evitar duplicados e garantir que recebe o resultado.
                                    <span style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: '#64748b' }}>🔒 Nunca enviaremos emails de marketing.</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={!data.name || !data.email}
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
                                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
                                cursor: data.name && data.email ? 'pointer' : 'not-allowed',
                                opacity: data.name && data.email ? 1 : 0.5,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {data.name && data.email ? '✨ Ver Meu Projeto' : 'Preencha os dados acima'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
