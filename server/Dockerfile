FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache g++ python3 openjdk17 docker-cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]