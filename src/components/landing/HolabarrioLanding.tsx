// components/LocalLinkLanding.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { Users, Store, Building, Crown, Landmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from "@/i18n/config";

interface LocalLinkLandingProps {
  locale: Locale;
  dictionary: any;
}

export function HolabarrioLanding({ locale, dictionary }: LocalLinkLandingProps) {
  const [rotation, setRotation] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const planets = [
    { id: 'usuarios', name: locale === 'es' ? 'Usuarios' : 'Users', icon: Users, color: 'from-emerald-400 to-emerald-600', startAngle: 0, route: '/users' },
    { id: 'comerciantes', name: locale === 'es' ? 'Comerciantes' : 'Merchants', icon: Store, color: 'from-cyan-400 to-cyan-600', startAngle: 72, route: '/merchants' },
    { id: 'asociaciones', name: locale === 'es' ? 'Asociaciones' : 'Associations', icon: Building, color: 'from-orange-400 to-orange-600', startAngle: 144, route: '/associations' },
    { id: 'clubes', name: locale === 'es' ? 'Clubes' : 'Clubs', icon: Crown, color: 'from-purple-400 to-purple-600', startAngle: 216, route: '/clubs' },
    { id: 'entidades', name: locale === 'es' ? 'Entidades Públicas' : 'Public Entities', icon: Landmark, color: 'from-lime-400 to-lime-600', startAngle: 288, route: '/public-entities' }
  ];

  const orbitalRadii = [160, 200, 240, 280, 320];

  const handlePlanetClick = (planetRoute: string) => { router.push(`/${locale}${planetRoute}`); };
  const calculatePlanetPosition = (startAngle: number, radius: number) => {
    const currentAngle = (startAngle + rotation) * (Math.PI / 180);
    const x = Math.cos(currentAngle) * radius;
    const y = Math.sin(currentAngle) * radius;
    return { x, y };
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-transparent">
      <div className="relative z-10 flex flex-col items-center justify-center h-screen p-4 text-center">
        
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl text-balance text-slate-800 dark:text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
          {dictionary?.home?.hero?.title || "Título por defecto"}
        </h1>
        <p className="text-lg md:text-2xl mt-4 max-w-2xl opacity-90 text-balance text-slate-600 dark:text-gray-300" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
          {dictionary?.home?.hero?.subtitle || "Subtítulo por defecto"}
        </p>

        {/* --- INICIO DE LOS CAMBIOS --- */}

        {/* 1. POSICIÓN: El botón ahora está aquí, antes del sistema solar. */}
        {/* 2. ESTÉTICA: Se han cambiado las clases para darle un color vibrante. */}
        <Link
          href="#features" 
          className="
            relative z-20 mt-12 px-8 py-4 rounded-full font-semibold text-lg text-white
            bg-gradient-to-r from-purple-600 to-blue-500 
            hover:from-purple-500 hover:to-blue-400
            transition-all duration-300 transform hover:scale-105 
            shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800
          "
        >
          {dictionary?.home?.hero?.getStarted || "Inicia tu Exploración"}
        </Link>
        
        {/* --- FIN DE LOS CAMBIOS --- */}

        <div className="relative flex items-center justify-center mt-8" style={{ width: `${orbitalRadii[4] * 2 + 80}px`, height: `${orbitalRadii[4] * 2 + 80}px` }}>
          
          {orbitalRadii.map(radius => (
            <div 
              key={`orbit-${radius}`}
              className="absolute rounded-full border border-slate-900/10 dark:border-white/10"
              style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
            />
          ))}
          
          <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-yellow-300 via-orange-500 to-red-500 flex items-center justify-center cursor-default z-20">
            <div className="absolute inset-0 rounded-full sun-glow" /> 
            <span className="relative font-bold text-lg md:text-xl text-center leading-tight text-white">
              LOCAL<br/>LINK
            </span>
          </div>

          {planets.map((planet, index) => {
            const Icon = planet.icon;
            const radius = orbitalRadii[index];
            const position = calculatePlanetPosition(planet.startAngle, radius);
            
            return (
              <div
                key={planet.id}
                className="absolute top-1/2 left-1/2 z-10"
                style={{ transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`, transition: 'none' }}
              >
                <button
                  onClick={() => handlePlanetClick(planet.route)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${planet.color} shadow-lg dark:shadow-xl flex flex-col items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl dark:hover:shadow-white/20 group`}
                >
                  <Icon size={20} className="mb-1 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-xs font-semibold text-center leading-tight">{planet.name}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};