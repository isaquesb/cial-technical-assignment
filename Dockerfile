FROM node:18-alpine

LABEL maintainer="Isaque de Souza Barbosa"

ENV TZ=America/Sao_Paulo

WORKDIR /var/www/html

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "."]
