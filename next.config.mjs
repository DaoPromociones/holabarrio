/** @type {import('next').NextConfig} */
const nextConfig = {
  // De momento lo dejamos vacío,
  // aquí iría configuración futura si la necesitamos.
  reactStrictMode: true,
  // Activa la salida optimizada para Docker
  output: 'standalone',
};

export default nextConfig;