// components/CitizenSection.tsx

"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { ArrowRight, Bus, ParkingCircle, Megaphone, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Locale } from "@/i18n/config"; // Aseguramos que el tipo Locale esté disponible

interface CitizenSectionProps {
  locale: Locale;
  dictionary: any;
}

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
    <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
    <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-slate-900">
      {children}
    </div>
  </div>
);

export function CitizenSection({ locale, dictionary }: CitizenSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features: { id: string; icon: LucideIcon; textKey: string }[] = [
    { id: 'transport', icon: Bus, textKey: 'feature_transport' },
    { id: 'parking', icon: ParkingCircle, textKey: 'feature_parking' },
    { id: 'incidents', icon: Megaphone, textKey: 'feature_incidents' },
    { id: 'agenda', icon: CalendarDays, textKey: 'feature_agenda' },
  ];

  return (
    <section id="features" className="w-full py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* CAMBIO CLAVE: Añadimos .home a la ruta del diccionario */}
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.citizen_section?.title || "Tu día a día, conectado."}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-700 dark:text-gray-200" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.citizen_section?.subtitle || "Toda la información que necesitas en la palma de tu mano."}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <PhoneFrame>
              <div className="p-8 h-full flex flex-col justify-center items-center space-y-8">
                {features.map((feature) => (
                  <div key={feature.id} className={`flex items-center space-x-4 p-4 rounded-lg w-full transition-all duration-300 ${hoveredFeature === feature.id ? 'bg-blue-100 dark:bg-purple-900/50 scale-105' : 'bg-gray-100 dark:bg-slate-800'}`}>
                    <feature.icon className={`w-8 h-8 transition-colors duration-300 ${hoveredFeature === feature.id ? 'text-blue-600 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`} />
                    <span className={`font-medium transition-colors duration-300 ${hoveredFeature === feature.id ? 'text-blue-800 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {/* CAMBIO CLAVE: Añadimos .home a la ruta del diccionario */}
                      {(dictionary?.home?.citizen_section?.[feature.textKey] || "Característica").split(' ')[0]}...
                    </span>
                  </div>
                ))}
              </div>
            </PhoneFrame>
          </div>
          <div className="flex flex-col space-y-8">
            {features.map((feature) => (
              <div key={feature.id} onMouseEnter={() => setHoveredFeature(feature.id)} onMouseLeave={() => setHoveredFeature(null)} className="p-6 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/60 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-purple-900/50 rounded-full">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-purple-300" />
                  </div>
                  <p className="text-lg md:text-xl text-slate-700 dark:text-gray-200">
                    {/* CAMBIO CLAVE: Añadimos .home a la ruta del diccionario */}
                    {dictionary?.home?.citizen_section?.[feature.textKey] || "Descripción detallada de la característica."}
                  </p>
                </div>
              </div>
            ))}
            {/* 2. ESTE ES EL NUEVO BLOQUE DE CÓDIGO PARA LA LLAMADA A LA ACCIÓN */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50">
              <Link 
                href={`/${locale}/mapa`} 
                className="
                  inline-flex items-center justify-center w-full md:w-auto px-6 py-3 
                  font-semibold text-white
                  bg-purple-600  hover:bg-slate-700 
                  dark:bg-purple-600 dark:hover:bg-purple-500 
                  rounded-lg transition-colors duration-300 shadow-lg"
              >
                {dictionary?.home?.citizen_section?.cta || "Explorar el mapa"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}