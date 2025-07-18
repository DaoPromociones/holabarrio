// components/CouncilModules.tsx

"use client";

import React from 'react';
import { BarChartBig, Vote, Siren } from 'lucide-react';

interface CouncilModulesProps {
  dictionary: any;
}

export function CouncilModules({ dictionary }: CouncilModulesProps) {
  const texts = dictionary?.modules_section;

  const modules = [
    { 
      icon: <BarChartBig className="w-10 h-10 text-blue-500" />,
      title: texts?.module1_title,
      description: texts?.module1_description,
      features: [texts?.module1_feature1, texts?.module1_feature2, texts?.module1_feature3]
    },
    { 
      icon: <Vote className="w-10 h-10 text-emerald-500" />,
      title: texts?.module2_title,
      description: texts?.module2_description,
      features: [texts?.module2_feature1, texts?.module2_feature2, texts?.module2_feature3]
    },
    { 
      icon: <Siren className="w-10 h-10 text-rose-500" />,
      title: texts?.module3_title,
      description: texts?.module3_description,
      features: [texts?.module3_feature1, texts?.module3_feature2, texts?.module3_feature3]
    }
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {texts?.title || "Módulos de Inteligencia"}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-gray-300">
            {texts?.subtitle || "Potencie su gestión con herramientas avanzadas."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <div key={index} className="bg-white dark:bg-slate-800/50 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="mb-6">{module.icon}</div>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">
                {module.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                {module.description}
              </p>
              <ul className="space-y-3 text-sm">
                {module.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

// Pequeño componente de icono para las listas, para no importarlo en cada iteración
function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}