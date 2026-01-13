# Simple Next.js dev image
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
RUN npm install

COPY . .

EXPOSE 3005
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3005"]
