// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers"; // <-- Importamos el nuevo
import "./globals.css";

const inter = localFont({ src: '../assets/fonts/inter-v19-latin-regular.woff2' });

export const metadata: Metadata = {
  title: "HolaBarrio - La Plataforma que Ayuda a la Gente de tu Pueblo.",
  description: "Descubre la SuperApp todo-en-uno para Ciudadan@s, Comerciant@s, Asociaciones y Admin Publicas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers> {/* <-- Envolvemos con el componente unificado */}
          {children}
        </Providers>
      </body>
    </html>
  );
}