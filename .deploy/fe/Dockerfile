# build ra production
FROM node:18-alpine as build-env

WORKDIR /app

# Build args
ARG API_BASE_URL
ARG OPENAI_API_KEY
ARG OPENAI_ENDPOINT 

# Environment vars
ARG REACT_APP_OPENAI_API_KEY
ARG REACT_APP_AZURE_SEARCH_KEY

ENV REACT_APP_OPENAI_API_KEY=$REACT_APP_OPENAI_API_KEY
ENV REACT_APP_AZURE_SEARCH_KEY=$REACT_APP_AZURE_SEARCH_KEY

COPY fe .

RUN yarn install --no-frozen-lockfile && yarn build

# serve CDN o day
FROM nginx:1.18-alpine as deploy-env

WORKDIR /deploy

COPY .deploy/fe/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-env /app/build/ .

EXPOSE 80