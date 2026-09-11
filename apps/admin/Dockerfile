FROM node:18-alpine
WORKDIR /app
COPY ./apps/admin/package*.json ./
RUN npm install
COPY ./apps/admin .
EXPOSE 3003
CMD ["npm", "run", "dev"]
