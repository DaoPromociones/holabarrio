// components/Footer.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Twitter, Instagram } from 'lucide-react';
import type { Locale } from '@/i18n/config';

interface FooterProps {
  locale: Locale;
  dictionary: any; 
}

export function Footer({ locale, dictionary }: FooterProps) {
  const year = new Date().getFullYear();
  const footerTexts = dictionary?.footer;

  return (
    // Simplificamos el contenedor principal
    <footer className="bg-cyan-200/100 dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-4">
              <Image 
                src="/logo.png"
                alt="HolaBarrio Logo" 
                width={128}
                height={128}
                className="h-20 w-20"
              />
              <span className="text-2xl font-bold text-gray-800">HolaBarrio</span>
            </Link>
            {/* CAMBIO: Color explícito para el tagline */}
            <p className="text-sm max-w-xs pr-4 text-gray-400">
              {footerTexts?.tagline || "Conectando comunidades..."}
            </p>
            <div className="flex space-x-4 mt-6">
              {/* CAMBIO: Color explícito para los iconos sociales */}
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors"><Linkedin /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors"><Twitter /></a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors"><Instagram /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wider uppercase">
              {footerTexts?.product_title || "Producto"}
            </h4>
            <ul className="space-y-3">
              {/* CAMBIO: Color explícito para cada enlace */}
              <li><Link href={`/${locale}/#features`} className="text-gray-400 hover:text-white transition-colors">{footerTexts?.product_citizens || "Ciudadanos"}</Link></li>
              <li><Link href={`/${locale}/#commerce`} className="text-gray-400 hover:text-white transition-colors">{footerTexts?.product_businesses || "Comercios"}</Link></li>
              <li><Link href={`/${locale}/#associations`} className="text-gray-400 hover:text-white transition-colors">{footerTexts?.product_associations || "Asociaciones"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wider uppercase">
              {footerTexts?.company_title || "Compañía"}
            </h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">{footerTexts?.company_about || "Sobre Nosotros"}</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">{footerTexts?.company_contact || "Contacto"}</Link></li>
              <li><Link href={`/${locale}/para-ayuntamientos`} className="text-gray-400 hover:text-white transition-colors">{footerTexts?.company_gov || "Ayuntamientos"}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wider uppercase">
              {footerTexts?.legal_title || "Legal"}
            </h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">{footerTexts?.legal_privacy || "Privacidad"}</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">{footerTexts?.legal_cookies || "Cookies"}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{footerTexts?.legal_notice || "Aviso Legal"}</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-sm">
          {/* CAMBIO: Color explícito para el copyright */}
          <p className="text-gray-500">{`© ${year} HolaBarrio. ${footerTexts?.copyright || "Todos los derechos reservados."}`}</p>
        </div>
      </div>
    </footer>
  );
}