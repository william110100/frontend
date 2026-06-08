# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app
COPY package.json yarn.lock ./

FROM base AS deps
RUN yarn install --frozen-lockfile

FROM deps AS build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN groupadd -r app && useradd -r -g app app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
USER app
EXPOSE 3000
CMD ["node", "server.js"]
