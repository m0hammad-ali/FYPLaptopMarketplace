FROM node:18-alpine
WORKDIR /app
COPY ./apps/auth/package*.json ./
RUN npm install --include=dev --no-audit --no-fund || true
COPY ./apps/auth .
EXPOSE 3004
CMD ["sh", "-c", "npm install --include=dev --no-audit --no-fund && npm run dev"]
