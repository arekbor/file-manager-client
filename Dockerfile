FROM node:18.14.1 AS builder

ENV NODE_ENV production

WORKDIR /app

COPY ./package.json ./
RUN npm install --force

COPY . .

RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf