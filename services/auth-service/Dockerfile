FROM node:18-alpine
WORKDIR /app
COPY ./services/auth-service/package*.json ./
RUN npm install
COPY ./services/auth-service .
EXPOSE 5001
CMD ["npm", "run", "dev"]
