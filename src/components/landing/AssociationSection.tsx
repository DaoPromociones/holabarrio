// components/AssociationSection.tsx

"use client";


import React, { useState } from 'react';
import { CalendarCheck, Users, Megaphone, ArrowRight } from 'lucide-react'; 
import type { LucideIcon } from 'lucide-react';
import type { Locale } from "@/i18n/config";
import Link from 'next/link';

interface AssociationSectionProps {
  locale: Locale;
  dictionary: any;
}

// Sub-componente visual para el panel de calendario
const CalendarPanel = ({ hoveredFeature }: { hoveredFeature: string | null }) => {
  const events = [
    { id: 'events', icon: CalendarCheck, title: "Ensayo General", time: "18:00" },
    { id: 'members', icon: Users, title: "Reunión de Socios", time: "20:00" },
    { id: 'visibility', icon: Megaphone, title: "Día de Puertas Abiertas", time: "Todo el día" }
  ];

  const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();

  return (
    <div className="relative mx-auto bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl h-auto w-full max-w-md shadow-2xl p-6 backdrop-blur-sm">
      <div className="text-center font-bold text-lg text-slate-700 dark:text-gray-200 mb-4">{currentMonth}</div>
      <div className="space-y-3">
        {events.map(event => (
          <div
            key={event.id}
            className={`p-4 rounded-lg flex items-center space-x-4 transition-all duration-300 ${
              hoveredFeature === event.id ? 'bg-rose-100 dark:bg-amber-900/50 scale-105' : 'bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            <div className={`p-2 rounded-lg transition-colors duration-300 ${
              hoveredFeature === event.id ? 'bg-rose-200 dark:bg-amber-800' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              <event.icon className={`w-6 h-6 transition-colors duration-300 ${
                hoveredFeature === event.id ? 'text-rose-600 dark:text-amber-300' : 'text-slate-500 dark:text-gray-400'
              }`} />
            </div>
            <div className="flex-grow">
              <p className={`font-semibold text-slate-800 dark:text-gray-100`}>{event.title}</p>
              <p className={`text-sm text-slate-500 dark:text-gray-400`}>{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function AssociationSection({ locale, dictionary }: AssociationSectionProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    { id: 'events', icon: CalendarCheck, textKey: 'feature_events' },
    { id: 'members', icon: Users, textKey: 'feature_members' },
    { id: 'visibility', icon: Megaphone, textKey: 'feature_visibility' },
  ];

  return (
    <section id="associations" className="w-full py-20 md:py-32 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.association_section?.title || "Organiza y Dinamiza tu Comunidad."}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-700 dark:text-gray-200" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
            {dictionary?.home?.association_section?.subtitle || "La plataforma para conectar con tus miembros."}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna Izquierda: El Panel de Calendario */}
          <div className="flex justify-center">
            <CalendarPanel hoveredFeature={hoveredFeature} />
          </div>
          {/* Columna Derecha: El Texto de las Características */}
          <div className="flex flex-col space-y-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className="p-6 rounded-xl transition-all duration-300 cursor-pointer bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-rose-100 dark:bg-amber-900/50 rounded-full">
                    <feature.icon className="w-6 h-6 text-rose-600 dark:text-amber-300" />
                  </div>
                  <p className="text-lg md:text-xl text-slate-700 dark:text-gray-200">
                    {dictionary?.home?.association_section?.[feature.textKey] || "Descripción de la característica."}
                  </p>
                </div>
              </div>
            ))}
             {/* --- INICIO DEL CAMBIO --- */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href={`/${locale}/auth/signup?role=association`} // Ejemplo de URL para registro de asociación
                className="
                  inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 
                  font-semibold text-white
                  bg-rose-600 hover:bg-rose-500 
                  dark:bg-amber-600 dark:hover:bg-amber-500
                  rounded-lg transition-colors duration-300 shadow-lg"
              >
                {dictionary?.home?.association_section?.cta_primary || "Registrar mi Asociación"}
              </Link>
              <Link
                href={`/${locale}/about`} // Ejemplo de URL a la página de 'acerca de' o 'contacto'
                className="
                  inline-flex items-center justify-center w-full sm:w-auto
                  font-semibold text-slate-700 dark:text-gray-200
                  hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {dictionary?.home?.association_section?.cta_secondary || "Saber más"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            {/* --- FIN DEL CAMBIO --- */}
          </div>
        </div>
      </div>
    </section>
  );
}