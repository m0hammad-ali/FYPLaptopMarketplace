FROM node:18-alpine
WORKDIR /app
COPY ./apps/customer/package*.json ./
RUN npm install --include=dev --no-audit --no-fund
COPY ./apps/customer .
EXPOSE 3001
CMD ["npm", "run", "dev"]
