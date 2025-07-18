"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "./language-switcher"
import { Menu, X, Sun, Moon } from "lucide-react" 
import type { Locale } from "@/i18n/config"
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9 p-2" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

interface NavigationProps {
  locale: Locale
  dictionary: any
}

export function Navigation({ locale, dictionary }: NavigationProps) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const getInitials = (name?: string | null) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <Image src="/logo.png" alt="HolaBarrio Logo" width={40} height={40} />
              <span>HolaBarrio</span>                
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link href={`/${locale}/mapa`} className="transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                {dictionary?.navigation?.mapa || "Mapa"}
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <LanguageSwitcher currentLocale={locale} />
              <ThemeToggleButton />
              
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none rounded-full">
                      <Avatar>
                        <AvatarImage src={session.user?.image || ''} alt="Avatar" />
                        <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{session.user?.name || session.user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/dashboard`}>{dictionary?.navigation?.dashboard || "Panel"}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                      {dictionary?.navigation?.logout || "Cerrar Sesión"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${locale}/auth/signin`}>{dictionary?.navigation?.login || "Iniciar Sesión"}</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/${locale}/auth/signup`}>{dictionary?.navigation?.register || "Registrarse"}</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <ThemeToggleButton />
              <button onClick={toggleMenu} className="p-2" aria-label="Toggle menu">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={closeMenu}>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="fixed right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold">Menú</span>
              <button onClick={closeMenu} aria-label="Cerrar menú"><X /></button>
            </div>
            <div className="flex flex-col space-y-4">
              <Link href={`/${locale}/mapa`} onClick={closeMenu}>{dictionary?.navigation?.mapa || "Mapa"}</Link>
              <DropdownMenuSeparator />
              {session ? (
                <>
                  <Link href={`/${locale}/dashboard`} onClick={closeMenu}>{dictionary?.navigation?.dashboard || "Panel"}</Link>
                  <button onClick={() => { closeMenu(); signOut(); }}>{dictionary?.navigation?.logout || "Cerrar Sesión"}</button>
                </>
              ) : (
                <>
                  <Link href={`/${locale}/auth/signin`} onClick={closeMenu}>{dictionary?.navigation?.login || "Iniciar Sesión"}</Link>
                  <Link href={`/${locale}/auth/signup`} onClick={closeMenu}>{dictionary?.navigation?.register || "Registrarse"}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}