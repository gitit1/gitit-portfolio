# Self-hosted image for Coolify (or any Docker host).
#
# Stage 1 builds the static Vite site (`build/`) and bundles the Node server +
# the web-standard API handlers into a single file (`dist-server/index.mjs`).
# Stage 2 ships only those two artifacts — no node_modules, no source.
#
#   docker build -t gititregev-site .
#   docker run --rm -p 3000:3000 -e ANTHROPIC_API_KEY=sk-... gititregev-site

# ---------------------------------------------------------------- builder ---
FROM node:22-alpine AS builder
WORKDIR /app

# Dependencies first so the layer caches across source-only changes.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# `prebuild` (tsx scripts/generate-static.mts) regenerates public/llms.txt and
# public/resume.json, then vite build emits build/.
RUN npm run build && npm run build:server

# ---------------------------------------------------------------- runtime ---
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/dist-server ./dist-server

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist-server/index.mjs"]
