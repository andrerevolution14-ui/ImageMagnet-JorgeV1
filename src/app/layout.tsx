import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Jorge • O Potencial da sua Casa em Aveiro",
    description: "Antes de mexer numa parede, veja como a sua casa em Aveiro pode ficar. Visualização IA gratuita e sem compromisso.",
};

import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt">
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
