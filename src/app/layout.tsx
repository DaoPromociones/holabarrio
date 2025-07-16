// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from 'next/font/local';
import { NextAuthProvider } from "./providers"; // <-- 1. Importar
import "./globals.css";

const inter = localFont({
  src: '../assets/fonts/inter-v19-latin-regular.woff2',
  display: 'swap',
  variable: '--font-inter', // Opcional, para usar con Tailwind
})

export const metadata: Metadata = {
  title: "HolaBarrio",
  description: "Descubre y conecta con tu entorno local",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider> 
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}