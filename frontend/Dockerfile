FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all React frontend files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]