FROM node:18-alpine
WORKDIR /app
COPY ./services/api-gateway/package*.json ./
RUN npm install
COPY ./services/api-gateway .
EXPOSE 5000
CMD ["npm", "run", "dev"]
