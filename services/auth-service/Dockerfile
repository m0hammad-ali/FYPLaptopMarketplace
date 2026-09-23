FROM node:18-alpine
WORKDIR /app
COPY ./services/auth-service/package*.json ./
RUN npm install --omit=optional --no-audit --no-fund
COPY ./services/auth-service .
EXPOSE 5001
CMD ["npm", "start"]
