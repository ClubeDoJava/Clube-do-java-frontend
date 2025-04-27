FROM node:18-alpine as build

WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm ci

# Copia o restante do código fonte
COPY . .

# Compila o aplicativo para produção
RUN npm run build --prod

# Estágio de produção: Nginx para servir conteúdo estático
FROM nginx:alpine

# Copia os arquivos compilados do estágio de build
COPY --from=build /app/dist/clube-do-java-frontend /usr/share/nginx/html

# Copia a configuração personalizada do Nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx no modo daemon off
CMD ["nginx", "-g", "daemon off;"]