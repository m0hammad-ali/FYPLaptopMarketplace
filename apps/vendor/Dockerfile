FROM node:18-alpine
WORKDIR /app
COPY ./apps/vendor/package*.json ./
RUN npm install
COPY ./apps/vendor .
EXPOSE 3002
CMD ["npm", "run", "dev"]
