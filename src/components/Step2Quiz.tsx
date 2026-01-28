'use client';

import { Shield, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { FunnelData } from './Funnel';
import { useState } from 'react';
import { event } from './FacebookPixel';

interface Step2Props {
    data: FunnelData;
    updateData: (data: Partial<FunnelData>) => void;
    onNext: () => void;
}

export default function Step2Quiz({ data, updateData, onNext }: Step2Props) {
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

    const handleSubmit = () => {
        // Track completion of the form with a base value
        event('Lead', {
            content_name: 'Formulário Completo',
            content_category: 'Conversion',
            value: 5.00,
            currency: 'EUR'
        });
        onNext();
    };

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '48px 16px', position: 'relative', zIndex: 20 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.2,
                    padding: '0 16px'
                }}>
                    Onde enviamos o resultado?
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Preview of blurred image */}
                {data.image && (
                    <div style={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '2px solid #e2e8f0'
                    }}>
                        <img
                            src={data.image}
                            alt="Preview"
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                filter: 'blur(25px)',
                                transform: 'scale(1.1)'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{
                                fontSize: '32px'
                            }}>🔒</div>
                            <p style={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '16px',
                                textAlign: 'center',
                                padding: '0 20px'
                            }}>
                                O seu resultado está quase pronto!
                            </p>
                        </div>
                    </div>
                )}

                {/* Email Input with Icon */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 1
                        }}>
                            <Mail size={22} strokeWidth={2.5} />
                        </div>
                        <input
                            type="email"
                            placeholder="o-seu-email@exemplo.com"
                            value={data.email}
                            onChange={(e) => {
                                const val = e.target.value.trim();
                                updateData({ email: val });
                                validateEmail(val);
                            }}
                            style={{
                                width: '100%',
                                height: '68px',
                                paddingLeft: '56px',
                                paddingRight: '24px',
                                background: 'white',
                                border: `2px solid ${emailError ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '16px',
                                fontSize: '17px',
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
                        marginTop: '-12px'
                    }}>
                        ⚠️ {emailError}
                    </div>
                )}

                {/* Trust Signals - Multiple badges for maximum confidence */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    {/* Primary Trust Message */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                        border: '2px solid #bae6fd',
                        borderRadius: '14px'
                    }}>
                        <Shield style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} size={24} strokeWidth={2.5} />
                        <div style={{ fontSize: '14px', color: '#0c4a6e', lineHeight: 1.6 }}>
                            <span style={{ fontWeight: 700, color: '#0c4a6e', display: 'block', marginBottom: '4px' }}>
                                100% Privado e Seguro
                            </span>
                            O seu email é usado apenas para enviar o resultado. Nunca partilhamos os seus dados com terceiros.
                        </div>
                    </div>

                    {/* Security Badges Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px'
                    }}>
                        {/* SSL Encrypted Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 14px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px'
                        }}>
                            <Lock style={{ color: '#10b981', flexShrink: 0 }} size={18} strokeWidth={2.5} />
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                                SSL Encriptado
                            </div>
                        </div>

                        {/* GDPR Compliant Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 14px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px'
                        }}>
                            <CheckCircle2 style={{ color: '#10b981', flexShrink: 0 }} size={18} strokeWidth={2.5} />
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                                RGPD Conforme
                            </div>
                        </div>
                    </div>

                    {/* Additional Reassurance */}
                    <div style={{
                        padding: '12px',
                        background: '#fefce8',
                        border: '1px solid #fde047',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '13px', color: '#713f12', lineHeight: 1.5 }}>
                            <span style={{ fontWeight: 700 }}>✨ Sem spam, garantido.</span>
                            <span style={{ display: 'block', fontSize: '12px', marginTop: '2px', color: '#854d0e' }}>
                                Pode cancelar a subscrição a qualquer momento.
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={!!emailError || !data.email}
                    onClick={handleSubmit}
                    style={{
                        width: '100%',
                        height: '68px',
                        borderRadius: '16px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '19px',
                        color: 'white',
                        background: (emailError || !data.email)
                            ? '#cbd5e1'
                            : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #db2777 100%)',
                        boxShadow: (emailError || !data.email) ? 'none' : '0 10px 30px rgba(37, 99, 235, 0.4)',
                        cursor: (emailError || !data.email) ? 'not-allowed' : 'pointer',
                        opacity: (emailError || !data.email) ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (!emailError && data.email) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.5)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = (emailError || !data.email) ? 'none' : '0 10px 30px rgba(37, 99, 235, 0.4)';
                    }}
                >
                    {emailError ? '⚠️ Email Inválido' : (data.email ? '✨ Ver o Meu Resultado' : '📧 Introduza o Email')}
                </button>
            </div>
        </div>
    );
}
