FROM node:20-alpine

WORKDIR /app

# Instalar dependencias primero (cache-friendly)
COPY package*.json ./
RUN npm ci

# Copiar el resto
COPY . .

# Exponer puerto
EXPOSE 3002

# Por defecto corremos dev; en compose se sobreescribe con el "command"
CMD ["npm", "run", "dev"]
