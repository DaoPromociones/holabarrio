import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDictionary } from "@/i18n/get-dictionary"
import Link from "next/link"
import type { Locale } from "@/i18n/config"
import { Check, Star, ArrowRight } from 'lucide-react'

interface PricingPageProps {
  params: Promise<{
    locale: Locale
  }>
}

// Componente principal de la página de precios
export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params

  // Cargar diccionario de traducciones
  let dictionary
  try {
    dictionary = await getDictionary(locale)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    // Diccionario de respaldo en caso de error
    dictionary = {
      navigation: {
        home: "Inicio",
        features: "Características",
        pricing: "Precios",
        about: "Acerca de",
      },
    }
  }

  // Configuración de planes con precios mensuales y anuales
  const plans = [
    {
      name: locale === "es" ? "Básico" : "Basic",
      monthlyPrice: 9,
      annualPrice: 86, // 20% descuento (9 * 12 * 0.8)
      period: locale === "es" ? "/mes" : "/month",
      description: locale === "es" ? "Perfecto para empezar" : "Perfect to get started",
      features: [
        locale === "es" ? "Hasta 5 usuarios" : "Up to 5 users",
        locale === "es" ? "10GB de almacenamiento" : "10GB storage",
        locale === "es" ? "Soporte por email" : "Email support",
        locale === "es" ? "Integraciones básicas" : "Basic integrations",
      ],
      popular: false,
      cta: locale === "es" ? "Comenzar Gratis" : "Start Free",
    },
    {
      name: locale === "es" ? "Profesional" : "Professional",
      monthlyPrice: 29,
      annualPrice: 278, // 20% descuento (29 * 12 * 0.8)
      period: locale === "es" ? "/mes" : "/month",
      description: locale === "es" ? "Para equipos en crecimiento" : "For growing teams",
      features: [
        locale === "es" ? "Hasta 25 usuarios" : "Up to 25 users",
        locale === "es" ? "100GB de almacenamiento" : "100GB storage",
        locale === "es" ? "Soporte prioritario" : "Priority support",
        locale === "es" ? "Todas las integraciones" : "All integrations",
        locale === "es" ? "Análisis avanzados" : "Advanced analytics",
        locale === "es" ? "API completa" : "Full API access",
      ],
      popular: true,
      cta: locale === "es" ? "Más Popular" : "Most Popular",
    },
    {
      name: locale === "es" ? "Empresarial" : "Enterprise",
      monthlyPrice: null, // Precio personalizado
      annualPrice: null,
      customPrice: locale === "es" ? "Personalizado" : "Custom",
      period: "",
      description: locale === "es" ? "Para grandes organizaciones" : "For large organizations",
      features: [
        locale === "es" ? "Usuarios ilimitados" : "Unlimited users",
        locale === "es" ? "Almacenamiento ilimitado" : "Unlimited storage",
        locale === "es" ? "Soporte 24/7" : "24/7 support",
        locale === "es" ? "Integraciones personalizadas" : "Custom integrations",
        locale === "es" ? "SLA garantizado" : "Guaranteed SLA",
        locale === "es" ? "Gerente de cuenta dedicado" : "Dedicated account manager",
      ],
      popular: false,
      cta: locale === "es" ? "Contactar Ventas" : "Contact Sales",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sección Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {locale === "es" ? "Precios Simples y Transparentes" : "Simple and Transparent Pricing"}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
              {locale === "es"
                ? "Elige el plan perfecto para tu equipo. Cambia o cancela en cualquier momento."
                : "Choose the perfect plan for your team. Change or cancel anytime."}
            </p>

            {/* Información sobre descuento anual */}
            <div className="flex justify-center items-center space-x-4 mb-6 sm:mb-8">
              <Badge variant="secondary" className="text-xs">
                {locale === "es" ? "20% descuento en planes anuales" : "20% off annual plans"}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Tarjetas de precios */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative p-4 sm:p-8 ${
                  plan.popular ? "border-2 border-blue-500 shadow-xl md:scale-105" : "border shadow-md"
                }`}
              >
                {/* Badge de "Más Popular" */}
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {locale === "es" ? "Más Popular" : "Most Popular"}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6 sm:pb-8 space-y-1 sm:space-y-2">
                  <CardTitle className="text-xl sm:text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-2 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-bold">
                      {plan.customPrice || `$${plan.monthlyPrice}`}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Lista de características */}
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Botón de acción */}
                  <Button
                    className={`w-full text-sm sm:text-base ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link href={`/${locale}/auth/signup`}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de FAQ */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
              {locale === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  q: locale === "es" ? "¿Puedo cambiar de plan en cualquier momento?" : "Can I change plans anytime?",
                  a:
                    locale === "es"
                      ? "Sí, puedes actualizar o degradar tu plan en cualquier momento desde tu panel de control."
                      : "Yes, you can upgrade or downgrade your plan anytime from your dashboard.",
                },
                {
                  q: locale === "es" ? "¿Hay algún compromiso a largo plazo?" : "Is there any long-term commitment?",
                  a:
                    locale === "es"
                      ? "No, todos nuestros planes son flexibles y puedes cancelar en cualquier momento."
                      : "No, all our plans are flexible and you can cancel anytime.",
                },
                {
                  q: locale === "es" ? "¿Qué métodos de pago aceptan?" : "What payment methods do you accept?",
                  a:
                    locale === "es"
                      ? "Aceptamos todas las tarjetas de crédito principales, PayPal y transferencias bancarias."
                      : "We accept all major credit cards, PayPal, and bank transfers.",
                },
                {
                  q:
                    locale === "es"
                      ? "¿Ofrecen descuentos para organizaciones sin fines de lucro?"
                      : "Do you offer discounts for nonprofits?",
                  a:
                    locale === "es"
                      ? "Sí, ofrecemos descuentos especiales para organizaciones sin fines de lucro y educativas."
                      : "Yes, we offer special discounts for nonprofit and educational organizations.",
                },
              ].map((faq, index) => (
                <Card key={index} className="p-4 sm:p-6">
                  <CardContent className="p-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA final */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            {locale === "es" ? "¿Listo para Comenzar?" : "Ready to Get Started?"}
          </h2>
          <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
            {locale === "es"
              ? "Prueba gratis por 14 días. No se requiere tarjeta de crédito."
              : "Try free for 14 days. No credit card required."}
          </p>
          <Button size="lg" variant="secondary" className="w-full xs:w-auto" asChild>
            <Link href={`/${locale}/auth/signup`}>
              {locale === "es" ? "Comenzar Prueba Gratuita" : "Start Free Trial"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
