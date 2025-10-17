# Multi-stage build for Node.js application
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "run", "dev"]

# Production builder stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
# Add any build steps here if needed
# RUN npm run build

# Production runtime stage
FROM base AS production
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Copy production dependencies
COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules
COPY --chown=nodeuser:nodejs . .

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER nodeuser

CMD ["npm", "start"]