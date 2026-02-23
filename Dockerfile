FROM oven/bun:1

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json bun.lock ./
COPY engine/package.json engine/
COPY server/package.json server/
COPY client/package.json client/

RUN bun install --frozen-lockfile

# Copy source code
COPY engine/ engine/
COPY server/ server/
COPY client/ client/

# Build engine (shared types) → client (static SPA)
RUN bun run --cwd engine build
RUN bun run --cwd client build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "server/src/index.ts"]
