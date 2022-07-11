# building stage
FROM node:16 as build-env

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci --omit=dev

COPY src/. .

# production stage
FROM node:16-slim

USER node

COPY --from=build-env /app /app

WORKDIR /app

EXPOSE 8070

CMD [ "server.js" ]
