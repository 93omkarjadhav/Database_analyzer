FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all backend files (server.js, config, controllers, routes, etc.)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]