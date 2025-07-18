//components/responsive-indicator.tsx

"use client"

export function ResponsiveIndicator() {
  if (process.env.NODE_ENV === "production") return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-black bg-opacity-75 p-3 font-mono text-xs text-white">
      <div className="block xs:hidden">xs</div>
      <div className="hidden xs:block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  )
}
