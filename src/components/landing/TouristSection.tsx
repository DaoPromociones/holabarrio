// components/TouristSection.tsx

"use client";


import Link from 'next/link';
import React from 'react';
import { Map, Camera, Route, AudioLines, ArrowRight  } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Locale } from "@/i18n/config";

interface TouristSectionProps {
  locale: Locale;
  dictionary: any;
}

export function TouristSection({ locale, dictionary }: TouristSectionProps) {
const features: { id: string; icon: LucideIcon; textKey: string }[] = [
    { id: 'map', icon: Map, textKey: 'feature_map' },
    { id: 'pois', icon: Camera, textKey: 'feature_pois' },
    { id: 'routes', icon: Route, textKey: 'feature_routes' },
    { id: 'audio', icon: AudioLines, textKey: 'feature_audio' },
];

  return (
    <section id="tourist" className="w-full py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4">
        
        {/* Títulos de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.tourist_section?.title || "Tu Aventura Comienza Aquí."}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-700 dark:text-gray-200" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.tourist_section?.subtitle || "Diseñada para exploradores."}
          </p>
        </div>

        {/* Panel Central con la Ruta del Descubrimiento */}
        <div className="relative mx-auto bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl p-8 sm:p-12 backdrop-blur-lg">
          <div className="relative flex justify-between items-center">
            
            {/* SVG con la línea animada que conecta los puntos */}
            <svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none" className="absolute top-0 left-0 h-full w-full">
              <path 
                d="M 60 50 Q 250 10, 400 50 T 740 50" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                className="text-purple-300/70 dark:text-purple-400/70 draw-line-animation"
                strokeLinecap="round"
                strokeDasharray="5 10"
              />
            </svg>

            {/* Iconos de las características */}
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="z-10 flex flex-col items-center space-y-2 text-center group cursor-pointer">
                  <div className="p-4 bg-white/80 dark:bg-slate-800 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/50">
                    <Icon className="w-8 h-8 text-slate-800 dark:text-white" />
                  </div>
                  <p className="font-semibold text-sm sm:text-base text-slate-700 dark:text-gray-200 transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-300">
                    {dictionary?.home?.tourist_section?.[feature.textKey] || "Función"}
                  </p>
                </div>
              );
            })}
            {/* --- INICIO DEL CAMBIO --- */}
        <div className="mt-12 text-center">
            <Link 
                href={`/${locale}/mapa`} 
                className="
                inline-flex items-center justify-center px-8 py-4
                font-semibold text-white
                bg-cyan-600 hover:bg-slate-900 
                dark:bg-cyan-600 dark:hover:bg-purple-600 
                rounded-lg transition-colors duration-300 shadow-lg text-lg"
            >
                {dictionary?.home?.tourist_section?.cta || "Empezar a Explorar"}
                <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
        </div>
        {/* --- FIN DEL CAMBIO --- */}
          </div>
        </div>
        
      </div>
    </section>
  );
}