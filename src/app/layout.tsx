import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Casa de Sonho",
    description: "Veja o potencial oculto da sua casa em 30 segundos. Ferramenta de visualização inteligente para proprietários.",
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
