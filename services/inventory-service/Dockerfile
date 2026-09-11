FROM node:18-alpine
WORKDIR /app
COPY ./services/inventory-service/package*.json ./
RUN npm install
COPY ./services/inventory-service .
EXPOSE 5003
CMD ["npm", "run", "dev"]
