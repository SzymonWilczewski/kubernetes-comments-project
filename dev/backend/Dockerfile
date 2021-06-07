FROM node:alpine
WORKDIR /backend
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3030
ENV NODE_ENV production
CMD ["yarn", "run", "start"]
