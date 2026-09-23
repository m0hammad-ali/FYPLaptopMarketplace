FROM node:18-alpine
WORKDIR /app
COPY ./apps/vendor/package*.json ./
RUN npm install --include=dev --no-audit --no-fund
COPY ./apps/vendor .
EXPOSE 3001
CMD ["npm", "run", "dev"]
