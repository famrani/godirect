# --- STAGE 1: Build & Install ---
# FROM node:24-alpine AS builder
FROM node:24.16.0-alpine AS builder

WORKDIR /tmp
COPY package.json ./
RUN npm install

# Copy source and prune dev dependencies in the builder stage
WORKDIR /app
COPY . /app
RUN cp -a /tmp/node_modules /app/ && npm prune --omit=dev

# --- STAGE 2: Final Lean Runtime ---
FROM node:24.16.0-alpine
WORKDIR /app

# ONLY copy the pruned node_modules and source files from Stage 1
COPY --from=builder /app /app

CMD ["node","dist2/index.js","prod"]