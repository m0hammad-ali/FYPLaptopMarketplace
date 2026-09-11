FROM node:18-alpine
WORKDIR /app
COPY ./apps/home/package*.json ./
RUN npm install
COPY ./apps/home .
EXPOSE 3000
CMD ["npm", "run", "dev"]
