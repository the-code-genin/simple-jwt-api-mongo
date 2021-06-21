FROM node:current-alpine3.13
RUN apk add --update npm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run migration up
CMD [ "npm", "start" ]