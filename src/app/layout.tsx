// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers"; // <-- 1. Importar
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HolaBarrio",
  description: "Construido para la comunidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthProvider> {/* <-- 2. Envolver */}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}