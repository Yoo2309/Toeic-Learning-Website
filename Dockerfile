# build ra production
FROM node:18-alpine as build-env

WORKDIR /app

COPY . .

RUN yarn install --no-frozen-lockfile && yarn build

# serve CDN o day
FROM nginx:1.18-alpine as deploy-env

WORKDIR /deploy

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=build-env /app/build/ .

EXPOSE 80