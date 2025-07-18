import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDictionary } from "@/i18n/get-dictionary"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { Users, Target, Heart, ArrowRight } from "lucide-react"

interface AboutPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params

  let dictionary
  try {
    dictionary = await getDictionary(locale)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    dictionary = {
      navigation: {
        home: "Inicio",
        features: "Características",
        pricing: "Precios",
        about: "Acerca de",
      },
    }
  }

  const team = [
    {
      name: "Ana García",
      role: locale === "es" ? "CEO y Fundadora" : "CEO & Founder",
      bio:
        locale === "es"
          ? "15 años de experiencia en tecnología y liderazgo empresarial."
          : "15 years of experience in technology and business leadership.",
      avatar: "AG",
    },
    {
      name: "Carlos Rodríguez",
      role: locale === "es" ? "CTO" : "CTO",
      bio:
        locale === "es"
          ? "Experto en arquitectura de software y sistemas distribuidos."
          : "Expert in software architecture and distributed systems.",
      avatar: "CR",
    },
    {
      name: "María López",
      role: locale === "es" ? "Directora de Producto" : "Head of Product",
      bio:
        locale === "es"
          ? "Especialista en UX/UI con pasión por crear productos excepcionales."
          : "UX/UI specialist with a passion for creating exceptional products.",
      avatar: "ML",
    },
  ]

  const values = [
    {
      icon: Users,
      title: locale === "es" ? "Centrados en el Cliente" : "Customer-Centric",
      description:
        locale === "es"
          ? "Ponemos a nuestros clientes en el centro de todo lo que hacemos."
          : "We put our customers at the center of everything we do.",
    },
    {
      icon: Target,
      title: locale === "es" ? "Innovación Constante" : "Constant Innovation",
      description:
        locale === "es"
          ? "Siempre buscamos nuevas formas de mejorar y evolucionar."
          : "We always look for new ways to improve and evolve.",
    },
    {
      icon: Heart,
      title: locale === "es" ? "Pasión por la Excelencia" : "Passion for Excellence",
      description:
        locale === "es"
          ? "Nos esforzamos por la calidad en cada detalle de nuestro trabajo."
          : "We strive for quality in every detail of our work.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {locale === "es" ? "Nuestra Historia y Misión" : "Our Story and Mission"}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
              {locale === "es"
                ? "Desde 2020, hemos estado ayudando a empresas de todo el mundo a transformar la forma en que trabajan."
                : "Since 2020, we've been helping companies worldwide transform the way they work."}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                  {locale === "es" ? "Nuestra Historia" : "Our Story"}
                </h2>
                <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {locale === "es"
                    ? "Todo comenzó con una simple observación: las herramientas empresariales eran demasiado complicadas y fragmentadas. Decidimos crear una solución que fuera poderosa pero simple, completa pero intuitiva."
                    : "It all started with a simple observation: business tools were too complicated and fragmented. We decided to create a solution that was powerful yet simple, complete yet intuitive."}
                </p>
                <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                  {locale === "es"
                    ? "Hoy, más de 50,000 usuarios en todo el mundo confían en nuestra plataforma para hacer crecer sus negocios y alcanzar sus objetivos."
                    : "Today, over 50,000 users worldwide trust our platform to grow their businesses and achieve their goals."}
                </p>
                <Button className="w-full xs:w-auto" asChild>
                  <Link href={`/${locale}/contact`}>
                    {locale === "es" ? "Contáctanos" : "Contact Us"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 h-48 sm:h-64 md:h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl font-bold text-blue-600 mb-2">50K+</div>
                  <p className="text-sm sm:text-base text-gray-700">
                    {locale === "es" ? "Usuarios Satisfechos" : "Happy Users"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              {locale === "es" ? "Nuestros Valores" : "Our Values"}
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === "es"
                ? "Los principios que guían cada decisión que tomamos"
                : "The principles that guide every decision we make"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="p-4 sm:p-8 text-center border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{value.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              {locale === "es" ? "Conoce al Equipo" : "Meet the Team"}
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === "es"
                ? "Las personas apasionadas que hacen posible nuestra misión"
                : "The passionate people who make our mission possible"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="p-4 sm:p-8 text-center border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <span className="text-white font-bold text-lg sm:text-xl">{member.avatar}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{member.name}</h3>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium mb-3 sm:mb-4">{member.role}</p>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            {locale === "es" ? "¿Quieres Formar Parte de Nuestra Historia?" : "Want to Be Part of Our Story?"}
          </h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            {locale === "es"
              ? "Únete a miles de empresas que ya están transformando su forma de trabajar"
              : "Join thousands of companies that are already transforming how they work"}
          </p>
          <Button size="lg" variant="secondary" className="w-full xs:w-auto" asChild>
            <Link href={`/${locale}/auth/signup`}>
              {locale === "es" ? "Comenzar Ahora" : "Get Started"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
