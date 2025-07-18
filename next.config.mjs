/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // La configuración clave para nuestro despliegue con Docker
  output: 'standalone',

  // Forzamos la calidad del código en el build de producción
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  // Optimización de imágenes de nivel de producción
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    // En el futuro, aquí añadiremos los dominios de nuestras imágenes externas
    remotePatterns: [],
  },
};

export default nextConfig;