// app/[locale]/page.tsx

import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { HolabarrioLanding } from "@/components/landing/HolabarrioLanding";
import { CitizenSection } from "@/components/landing/CitizenSection";
import { CommerceSection } from "@/components/landing/CommerceSection";
import { AssociationSection } from "@/components/landing/AssociationSection";
import { TouristSection } from "@/components/landing/TouristSection";
import { PageCanvas } from "@/components/landing/PageCanvas ";

// Usamos tu interfaz de Props original, que Next.js ha confirmado que es la correcta
interface HomePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

// La función vuelve a ser async y sigue tu patrón original
export default async function HomePage({ params }: HomePageProps) {
  // Usamos 'await' para resolver la promesa de los params, como indica el error
  const { locale } = await params;
  
  // Tu lógica para obtener el diccionario, que ya funcionaba
  let dictionary;
  try {
    dictionary = await getDictionary(locale);
  } catch (error) {
    console.error("Error loading dictionary:", error);
    // Fallback dictionary
    dictionary = {
      home: {
        hero: {
          title: "La plataforma que Ayuda a la Gente de tu Pueblo.",
          description: "Descubre la SuperApp todo-en-uno para Ciudadan@s, Comerciant@s, Asociaciones y Admin Publicas.",
          getStarted: "Comenzar Gratis",
        }
      },
      citizen_section: {
        title: "Tu día a día, conectado.",
        subtitle: "Toda la información que necesitas en la palma de tu mano.",
        feature_transport: "Sigue tu autobús y olvídate de las esperas.",
        feature_parking: "Encuentra aparcamiento libre antes de salir de casa.",
        feature_incidents: "Reporta una incidencia y participa en la mejora de tu ciudad.",
        feature_agenda: "No te pierdas nada: la agenda cultural y de ocio, unificada.",
        cta: "Explora estas funciones en la app →"
      },
      commerce_section: {
       title: "Potencia tu Negocio Local.",
       subtitle: "Herramientas diseñadas para conectar tu comercio con la comunidad y aumentar tu visibilidad.",
       feature_geomarketing: "Llega a los clientes que pasan por tu puerta con promociones geolocalizadas.",
       feature_offers: "Publica ofertas y eventos en tiempo real para atraer a más público.",
       feature_stats: "Entiende a tus clientes con estadísticas sencillas sobre tu alcance y visitas.",
       cta: "Ver planes para comercios →"
      },
      association_section: {
       title: "Organiza y Dinamiza tu Comunidad.",
       subtitle: "La plataforma para que asociaciones y clubes conecten con sus miembros y con toda la ciudad.",
       feature_events: "Crea y promociona tus eventos en una agenda unificada que llega a todos.",
       feature_members: "Facilita la comunicación con tus socios y la gestión de tu comunidad.",
       feature_visibility: "Consigue un espacio propio para ganar visibilidad y atraer a nuevos miembros.",
       cta: "Más información para asociaciones →",

       },
       tourist_section: {
        title: "Tu Aventura Comienza Aquí.",
        subtitle: "Diseñada para exploradores. Convierte tu visita en una experiencia inolvidable con el guía definitivo en tu bolsillo.",
        feature_map: "Mapa Interactivo",
        feature_pois: "Puntos de Interés",
        feature_routes: "Rutas Sugeridas",
        feature_audio: "Audioguías",
        cta_title: "Lleva la guía definitiva en tu bolsillo"
  }
    };
  }
  

  return (
    // Usamos el PageCanvas que creamos para el fondo dinámico
    <PageCanvas>
      <HolabarrioLanding locale={locale} dictionary={dictionary} />
       <CitizenSection locale={locale} dictionary={dictionary} />
        <CommerceSection locale={locale} dictionary={dictionary} />
         <AssociationSection locale={locale} dictionary={dictionary} />
          <TouristSection locale={locale} dictionary={dictionary} /> 
    </PageCanvas>
  );
}