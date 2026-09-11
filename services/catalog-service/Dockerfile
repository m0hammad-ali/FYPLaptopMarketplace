FROM node:18-alpine
WORKDIR /app
COPY ./services/catalog-service/package*.json ./
RUN npm install
COPY ./services/catalog-service .
EXPOSE 5002
CMD ["npm", "run", "dev"]
