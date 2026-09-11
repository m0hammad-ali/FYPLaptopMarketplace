FROM node:18-alpine
WORKDIR /app
COPY ./services/location-service/package*.json ./
RUN npm install
COPY ./services/location-service .
EXPOSE 5006
CMD ["npm", "run", "dev"]
