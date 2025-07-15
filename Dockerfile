# Dockerfile

# 1. Etapa de dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# CORRECCIÓN AQUÍ: Añadido --ignore-scripts=false
RUN npm i -g pnpm && pnpm install --ignore-scripts=false --frozen-lockfile

# 2. Etapa de construcción (build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Genera los clientes de Prisma ANTES de construir la app
RUN npm i -g pnpm && pnpm db:generate

# Construye la aplicación de Next.js
RUN pnpm build

# 3. Etapa de producción
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]