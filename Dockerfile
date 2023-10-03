FROM node:18-alpine

LABEL maintainer="Isaque de Souza Barbosa"

ENV TZ=America/Sao_Paulo

WORKDIR /var/www/html

COPY . .

RUN yarn install \
    --silent \
    --pure-lockfile \
    --ignore-optional \
    --non-interactive \
    --prefer-offline \
    --cache-folder .yarn

EXPOSE 3000

ENTRYPOINT ["node", "."]
