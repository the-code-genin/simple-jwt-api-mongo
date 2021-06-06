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

# Expose the necessary ports
EXPOSE 8080

# Start app in production mode
CMD [ "npm", "start" ]