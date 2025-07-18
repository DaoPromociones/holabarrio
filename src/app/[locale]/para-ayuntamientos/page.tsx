// app/[locale]/para-ayuntamientos/page.tsx

import { getDictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import { CouncilHero } from "@/components/para-ayuntamientos/CouncilHero";
import { CouncilProblemSolution } from "@/components/para-ayuntamientos/CouncilProblemSolution";
import { CouncilModules } from "@/components/para-ayuntamientos/CouncilModules";
import { CouncilContactForm } from "@/components/para-ayuntamientos/CouncilContactForm";


// CAMBIO 1: La interfaz ahora define 'params' como una Promesa
interface CouncilPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function CouncilPage({ params }: CouncilPageProps) {
  // CAMBIO 2: Usamos 'await' para resolver la promesa y obtener el locale
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div>
      <CouncilHero locale={locale} dictionary={dictionary.council_page} />
       <CouncilProblemSolution dictionary={dictionary.council_page} /> 
        <CouncilModules dictionary={dictionary.council_page} />
          <CouncilContactForm dictionary={dictionary.council_page} />
    </div>
  );
}