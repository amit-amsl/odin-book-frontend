# Build stage

FROM node:20-bullseye-slim as build

WORKDIR /usr/src/app

COPY . .

ARG VITE_APP_API_URL

RUN npm ci

RUN npx vite build

# App serving stage

FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD [ "nginx", "-g", "daemon off;" ]