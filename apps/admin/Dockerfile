FROM node:18-alpine
WORKDIR /app
COPY ./apps/admin/package*.json ./
RUN npm install --include=dev --no-audit --no-fund
COPY ./apps/admin .
EXPOSE 3001
CMD ["npm", "run", "dev"]
