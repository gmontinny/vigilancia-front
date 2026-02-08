# Multi-stage build para otimização
FROM node:18-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Argumento para definir ambiente de build
ARG BUILD_ENV=production
ARG API_BASE_URL=http://localhost:8081
ARG RECAPTCHA_SITE_KEY=

# Criar arquivo de ambiente para build
RUN echo "export const environment = { production: ${BUILD_ENV} === 'production', apiBaseUrl: '${API_BASE_URL}', recaptcha: { siteKey: '${RECAPTCHA_SITE_KEY}' } };" > /app/src/environments/environment.ts

# Build da aplicação baseado no ambiente
RUN if [ "$BUILD_ENV" = "development" ] ; then npm run build ; else npm run build --prod ; fi

# Stage de produção com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist/vigilancia-front /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]