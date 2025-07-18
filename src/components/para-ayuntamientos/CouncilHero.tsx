// components/CouncilHero.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Locale } from "@/i18n/config";

interface CouncilHeroProps {
  locale: Locale;
  dictionary: any;
}

export function CouncilHero({ locale, dictionary }: CouncilHeroProps) {
  const heroTexts = dictionary?.hero; // Atajo para los textos del hero

  return (
    // Usamos un fondo oscuro y profesional para diferenciar esta página de la principal
    <section className="w-full bg-slate-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh] py-20">
          <h1 
            className="text-4xl lg:text-6xl font-bold max-w-4xl text-balance"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
          >
            {heroTexts?.title || "Título para Ayuntamientos"}
          </h1>
          <p 
            className="text-lg md:text-xl mt-6 max-w-2xl text-slate-300 text-balance"
          >
            {heroTexts?.subtitle || "Subtítulo de la sección."}
          </p>
          <div className="mt-10">
            <Link
              href="#contact"
              className="
                inline-flex items-center justify-center px-8 py-4 
                font-semibold text-lg text-slate-900
                bg-white hover:bg-slate-200 
                transition-colors duration-300 transform hover:scale-105
                rounded-lg shadow-2xl"
            >
              {heroTexts?.cta_button || "Solicitar Demo"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}