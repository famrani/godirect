# syntax=docker/dockerfile:1
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim AS build-base
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY docker/collect-build.cjs /build/collect-build.cjs

FROM build-base AS frontend-build
WORKDIR /workspace/app
COPY app/package.json app/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
COPY app/ ./
ARG FRONTEND_BUILD_SCRIPT=build
ARG FRONTEND_OUTPUT=auto
RUN npm run "$FRONTEND_BUILD_SCRIPT" \
    && node /build/collect-build.cjs frontend . "$FRONTEND_OUTPUT" /out/www

FROM build-base AS backend-build
WORKDIR /workspace/server
COPY server/package.json server/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
COPY server/ ./
ARG BACKEND_BUILD_SCRIPT=build
ARG BACKEND_OUTPUT=dist2
RUN npm run "$BACKEND_BUILD_SCRIPT" \
    && node /build/collect-build.cjs backend . "$BACKEND_OUTPUT" /out/backend \
    && npm prune --omit=dev

FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=2000 \
    HTTPS_ENABLED=false \
    FRONTEND_DIST=/opt/godirect/server/www
WORKDIR /opt/godirect/server
COPY --from=backend-build --chown=node:node /workspace/server/package.json ./package.json
COPY --from=backend-build --chown=node:node /workspace/server/node_modules ./node_modules
COPY --from=backend-build --chown=node:node /out/backend ./dist2
COPY --from=frontend-build --chown=node:node /out/www ./www
USER node
EXPOSE 2000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD node -e "const r=require('http').get({host:'127.0.0.1',port:process.env.PORT||2000,path:'/'},s=>{s.resume();process.exit(s.statusCode===200?0:1)});r.on('error',()=>process.exit(1));r.setTimeout(4000,()=>{r.destroy();process.exit(1)})"
CMD ["node", "dist2/index.js"]
