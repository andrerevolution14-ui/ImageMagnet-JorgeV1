'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export default function ClarityAnalytics() {
    useEffect(() => {
        const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

        if (projectId) {
            Clarity.init(projectId);
            console.log('Microsoft Clarity initialized with project ID:', projectId);
        } else {
            console.warn('Microsoft Clarity project ID not found in environment variables');
        }
    }, []);

    return null;
}
