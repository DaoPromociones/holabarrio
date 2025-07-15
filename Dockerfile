# Usa una imagen base de Node.js
FROM node:18-alpine

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json para instalar dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código de tu app
COPY . .

# Expone el puerto que usa Next.js
EXPOSE 3000

# El comando para iniciar el servidor de desarrollo
CMD ["npm", "run", "dev"]