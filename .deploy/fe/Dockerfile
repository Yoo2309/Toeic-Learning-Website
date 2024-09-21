# build ra production
FROM node:18-alpine as build-env

WORKDIR /app

# Build args
ARG API_BASE_URL
ARG OPENAI_API_KEY
ARG OPENAI_ENDPOINT 

# Environment vars
ENV API_BASE_URL=https://toeic.workon.space/api
ENV OPENAI_API_KEY=1a9a2e6c63aa4325a0f08a6d859e0daa
ENV OPENAI_ENDPOINT=https://230902.openai.azure.com/

COPY fe .

RUN yarn install --no-frozen-lockfile && yarn build

# serve CDN o day
FROM nginx:1.18-alpine as deploy-env

WORKDIR /deploy

COPY .deploy/fe/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-env /app/build/ .

EXPOSE 80