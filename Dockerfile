# Use alpine linux with node installed
FROM node:current-alpine3.13

# Image labels
LABEL description="A simple JWT API server that uses mongoDB as a DB"
LABEL version="1.0.0"

# Install npm
RUN apk add --update npm

# Copy the app files
WORKDIR /app
COPY . .

# Install npm packages
RUN npm install

# Start app in production mode
CMD [ "ts-node", "index.ts" ]