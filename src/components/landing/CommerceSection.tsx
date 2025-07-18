// components/CommerceSection.tsx

"use client";

import React, { useState } from 'react';
import { MapPin, TicketPercent, BarChart3, ArrowRight } from 'lucide-react'; // <-- Importamos ArrowRight
import type { LucideIcon } from 'lucide-react';
import type { Locale } from "@/i18n/config";
import Link from 'next/link'; // <-- Importamos Link

interface CommerceSectionProps {
  locale: Locale;
  dictionary: any;
}

// Un componente visual para el "Panel de Control"
const DashboardPanel = ({ hoveredFeature }: { hoveredFeature: string | null }) => {
  const features = [
    { id: 'geomarketing', icon: MapPin },
    { id: 'offers', icon: TicketPercent },
    { id: 'stats', icon: BarChart3 }
  ];

  return (
    <div className="relative mx-auto bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl h-auto w-full max-w-md shadow-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center space-x-2 mb-4">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
        <p className="text-sm font-medium text-slate-600 dark:text-gray-300 mb-4">Panel de Comerciante</p>
        <div className="space-y-4">
          {features.map(feature => (
            <div
              key={feature.id}
              className={`p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 ${
                hoveredFeature === feature.id ? 'bg-blue-100 dark:bg-purple-900/50 scale-105' : 'bg-white dark:bg-slate-900'
              }`}
            >
              <feature.icon className={`w-7 h-7 transition-colors duration-300 ${
                hoveredFeature === feature.id ? 'text-blue-600 dark:text-purple-300' : 'text-slate-500 dark:text-gray-400'
              }`} />
              <div className="flex-grow h-4 bg-slate-200 dark:bg-slate-700 rounded-full">
                <div 
                  className={`h-4 rounded-full bg-blue-500 dark:bg-purple-500 transition-all duration-500 ${
                    hoveredFeature === feature.id ? 'w-3/4' : 'w-1/3'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function CommerceSection({ locale, dictionary }: CommerceSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    { id: 'geomarketing', icon: MapPin, textKey: 'feature_geomarketing' },
    { id: 'offers', icon: TicketPercent, textKey: 'feature_offers' },
    { id: 'stats', icon: BarChart3, textKey: 'feature_stats' },
  ];

  return (
    <section id="commerce" className="w-full py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.commerce_section?.title || "Potencia tu Negocio Local."}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-700 dark:text-gray-200" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.commerce_section?.subtitle || "Herramientas diseñadas para conectar."}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <DashboardPanel hoveredFeature={hoveredFeature} />
          </div>
          <div className="flex flex-col space-y-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="p-6 rounded-xl transition-all duration-300 cursor-pointer bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <p className="text-lg md:text-xl text-slate-700 dark:text-gray-200">
                    {dictionary?.home?.commerce_section?.[feature.textKey] || "Descripción de la característica."}
                  </p>
                </div>
              </div>
            ))}
            {/* --- INICIO DEL CAMBIO --- */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href={`/${locale}/auth/signup?role=commerce`} // Ejemplo de URL para registro de comercio
                className="
                  inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 
                  font-semibold text-white
                  bg-emerald-600 hover:bg-emerald-500 
                  dark:bg-emerald-500 dark:hover:bg-emerald-400
                  rounded-lg transition-colors duration-300 shadow-lg"
              >
                {dictionary?.home?.commerce_section?.cta_primary || "Registrar mi Comercio"}
              </Link>
              <Link
                href={`/${locale}/pricing`} // Ejemplo de URL a la página de planes/ventajas
                className="
                  inline-flex items-center justify-center w-full sm:w-auto
                  font-semibold text-slate-700 dark:text-gray-200
                  hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {dictionary?.home?.commerce_section?.cta_secondary || "Conocer las ventajas"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}