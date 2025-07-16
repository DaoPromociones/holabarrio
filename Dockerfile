# Dockerfile

# 1. Etapa de dependencias
FROM node:20-alpine AS deps
# INSTALAMOS OPENSSL PARA QUE PRISMA LO DETECTE
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --ignore-scripts=false --frozen-lockfile

# 2. Etapa de construcción (build)
FROM node:20-alpine AS builder
WORKDIR /app
# INSTALAMOS OPENSSL TAMBIÉN AQUÍ PARA EL PASO DE GENERATE
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm i -g pnpm && pnpm db:generate
RUN pnpm build

# 3. Etapa de producción (SIMPLIFICADA Y CORRECTA)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiamos la carpeta public para los assets estáticos
COPY --from=builder /app/public ./public

# Copiamos la build standalone completa. Esto incluye el server.js, 
# node_modules y los ficheros estáticos necesarios.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# El comando de arranque ahora encontrará el server.js en la raíz de /app
CMD ["node", "server.js"]