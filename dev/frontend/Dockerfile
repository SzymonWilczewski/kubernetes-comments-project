FROM node:alpine AS builder
WORKDIR /frontend
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build

FROM nginx
COPY --from=builder /frontend/build /usr/share/nginx/html
