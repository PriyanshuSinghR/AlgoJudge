FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache docker-cli

COPY package*.json ./
RUN npm install

COPY . .

# Pre-create dirs (volumes will mount over these, but good practice)
RUN mkdir -p /app/codes /app/inputs

EXPOSE 8000

CMD ["node", "index.js"]