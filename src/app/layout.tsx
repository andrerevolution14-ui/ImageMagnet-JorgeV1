import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Remodelações Aveiro - Jorge",
    description: "Veja o potencial oculto da sua casa em 30 segundos. Ferramenta de visualização inteligente para proprietários na zona de Aveiro.",
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
