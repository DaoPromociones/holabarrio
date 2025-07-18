import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDictionary } from "@/i18n/get-dictionary"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { Shield, Zap, Users, BarChart3, Globe, Lock, Smartphone, Cloud, ArrowRight, Check } from "lucide-react"

interface FeaturesPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export default async function FeaturesPage({ params }: FeaturesPageProps) {
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

  const features = [
    {
      icon: Zap,
      title: locale === "es" ? "Rendimiento Ultrarrápido" : "Ultra-Fast Performance",
      description:
        locale === "es"
          ? "Optimizado para velocidad con tiempos de carga menores a 100ms"
          : "Optimized for speed with loading times under 100ms",
      color: "blue",
    },
    {
      icon: Shield,
      title: locale === "es" ? "Seguridad Avanzada" : "Advanced Security",
      description:
        locale === "es"
          ? "Cifrado end-to-end y cumplimiento con GDPR y SOC 2"
          : "End-to-end encryption and GDPR & SOC 2 compliance",
      color: "green",
    },
    {
      icon: Users,
      title: locale === "es" ? "Colaboración en Tiempo Real" : "Real-time Collaboration",
      description:
        locale === "es"
          ? "Trabaja en equipo con sincronización instantánea"
          : "Work as a team with instant synchronization",
      color: "purple",
    },
    {
      icon: BarChart3,
      title: locale === "es" ? "Análisis Inteligente" : "Smart Analytics",
      description: locale === "es" ? "Insights accionables con IA integrada" : "Actionable insights with integrated AI",
      color: "orange",
    },
    {
      icon: Globe,
      title: locale === "es" ? "Acceso Global" : "Global Access",
      description:
        locale === "es" ? "CDN mundial para acceso desde cualquier lugar" : "Global CDN for access from anywhere",
      color: "indigo",
    },
    {
      icon: Smartphone,
      title: locale === "es" ? "Móvil Primero" : "Mobile First",
      description:
        locale === "es"
          ? "Diseño responsive optimizado para todos los dispositivos"
          : "Responsive design optimized for all devices",
      color: "pink",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 sm:mb-6">
              ✨ {locale === "es" ? "Características Avanzadas" : "Advanced Features"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {locale === "es"
                ? "Funcionalidades que Impulsan tu Productividad"
                : "Features that Boost Your Productivity"}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
              {locale === "es"
                ? "Descubre todas las herramientas que necesitas para llevar tu negocio al siguiente nivel"
                : "Discover all the tools you need to take your business to the next level"}
            </p>
            <Button size="lg" className="w-full xs:w-auto" asChild>
              <Link href={`/${locale}/auth/signup`}>
                {locale === "es" ? "Comenzar Gratis" : "Start Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="p-4 sm:p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 sm:mb-6`}
                    >
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">
                {locale === "es" ? "Características Detalladas" : "Detailed Features"}
              </h2>
            </div>

            <div className="space-y-16 sm:space-y-20">
              {/* Feature 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                    {locale === "es" ? "Seguridad de Nivel Empresarial" : "Enterprise-Level Security"}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {locale === "es"
                      ? "Protege tus datos con las mejores prácticas de seguridad de la industria."
                      : "Protect your data with industry-leading security best practices."}
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      locale === "es" ? "Cifrado AES-256" : "AES-256 Encryption",
                      locale === "es" ? "Autenticación de dos factores" : "Two-factor authentication",
                      locale === "es" ? "Auditorías de seguridad regulares" : "Regular security audits",
                      locale === "es" ? "Cumplimiento GDPR" : "GDPR Compliance",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 h-64 sm:h-80 flex items-center justify-center">
                  <Lock className="h-16 w-16 sm:h-24 sm:w-24 text-green-600" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 h-64 sm:h-80 flex items-center justify-center">
                    <Cloud className="h-16 w-16 sm:h-24 sm:w-24 text-purple-600" />
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                    {locale === "es" ? "Infraestructura en la Nube" : "Cloud Infrastructure"}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                    {locale === "es"
                      ? "Escalabilidad automática y disponibilidad del 99.9% garantizada."
                      : "Automatic scalability and guaranteed 99.9% availability."}
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {[
                      locale === "es" ? "Auto-escalado inteligente" : "Smart auto-scaling",
                      locale === "es" ? "Backups automáticos" : "Automatic backups",
                      locale === "es" ? "CDN global" : "Global CDN",
                      locale === "es" ? "Monitoreo 24/7" : "24/7 Monitoring",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            {locale === "es" ? "¿Listo para Comenzar?" : "Ready to Get Started?"}
          </h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            {locale === "es"
              ? "Únete a miles de empresas que ya confían en nuestra plataforma"
              : "Join thousands of companies that already trust our platform"}
          </p>
          <Button size="lg" variant="secondary" className="w-full xs:w-auto" asChild>
            <Link href={`/${locale}/auth/signup`}>
              {locale === "es" ? "Comenzar Ahora" : "Start Now"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
