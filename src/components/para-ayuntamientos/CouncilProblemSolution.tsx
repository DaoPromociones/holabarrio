// components/CouncilProblemSolution.tsx

"use client";

import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

interface CouncilProblemSolutionProps {
  dictionary: any;
}

export function CouncilProblemSolution({ dictionary }: CouncilProblemSolutionProps) {
  const texts = dictionary?.problem_solution;

  const points = [
    { problem: texts?.problem1, solution: texts?.solution1 },
    { problem: texts?.problem2, solution: texts?.solution2 },
    { problem: texts?.problem3, solution: texts?.solution3 },
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
            {texts?.title || "Título de la sección"}
          </h2>
          <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-gray-300">
            {texts?.subtitle || "Subtítulo de la sección."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Columna de Problemas */}
          <div className="bg-slate-100 dark:bg-slate-900/50 p-8 rounded-xl">
            <h3 className="text-2xl font-semibold text-center mb-6 text-slate-800 dark:text-gray-200">
              {texts?.problem_title || "Retos"}
            </h3>
            <ul className="space-y-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="w-6 h-6 text-red-500 dark:text-red-400 mt-1 mr-4 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-gray-300">{point.problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna de Soluciones */}
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-8 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-2xl font-semibold text-center mb-6 text-emerald-800 dark:text-emerald-300">
              {texts?.solution_title || "Soluciones"}
            </h3>
            <ul className="space-y-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400 mt-1 mr-4 flex-shrink-0" />
                  <span className="text-slate-800 dark:text-emerald-100 font-medium">{point.solution}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}