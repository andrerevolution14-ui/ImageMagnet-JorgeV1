import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Jorge • O Potencial da sua Casa em Aveiro",
    description: "Antes de mexer numa parede, veja como a sua casa em Aveiro pode ficar. Visualização IA gratuita e sem compromisso.",
};

import { Analytics } from "@vercel/analytics/next"
import FacebookPixel from "@/components/FacebookPixel";
import { Suspense } from "react";
import Script from "next/script";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
            <body>
                <Script
                    id="microsoft-clarity"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c,l,a,r,i,t,y){
                                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                            })(window, document, "clarity", "script", "v8gy7ddb8x");
                        `,
                    }}
                />
                <Suspense fallback={null}>
                    <FacebookPixel />
                </Suspense>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
