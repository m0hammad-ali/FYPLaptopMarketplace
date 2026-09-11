FROM node:18-alpine
WORKDIR /app
COPY ./apps/auth/package*.json ./
RUN npm install
COPY ./apps/auth .
EXPOSE 3004
CMD ["npm", "run", "dev"]
