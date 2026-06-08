# Yellow Chat — Frontend

The web client for Yellow Chat: sign in, sign up, and a streaming chat workspace
with conversation history. Talks to the NestJS API over JWT + SSE.

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first, no `tailwind.config`)
- **HeroUI v3** (`@heroui/react` + `@heroui/styles`) — React-Aria-based components
- **TanStack Query v5** for server state
- **Tabler Icons** (`@tabler/icons-react`)

## Project layout

```
app/
  layout.tsx          root layout (Inter font, providers, light theme)
  providers.tsx       TanStack Query + HeroUI RouterProvider
  page.tsx            auth-aware splash redirect
  globals.css         Tailwind v4 + HeroUI styles
  (auth)/             /login, /signup
  (chat)/             protected shell (sidebar + auth guard), /chat, /chat/[id]
components/
  auth/               forms, fields (password show/hide), centered shell
  chat/               sidebar, conversation list/item, composer, message bubbles,
                      typing indicator, user menu, delete confirm dialog
  ui/                 brand mark, fullscreen loader
lib/
  http.ts             fetch wrapper: in-memory access token + single-flight refresh
  sse.ts              SSE (fetch + ReadableStream) token-stream parser
  api.ts              typed API calls (auth, conversations, messages)
  use-auth.ts         auth queries/mutations
  use-chat.ts         chat queries/mutations (optimistic + streaming)
  types.ts keys.ts pending.ts format.ts
utils/constants.ts    app name, API base URL, routes
```

## Run locally

Requires the backend API running (see `../backend`).

```bash
yarn install
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api" > .env.local
yarn dev            # http://localhost:3000
```

Other scripts: `yarn build` (production build), `yarn start` (serve the build).
`NEXT_PUBLIC_API_URL` defaults to `/api` (same-origin behind nginx) when unset.

## Deploy via Docker

The `Dockerfile` is a multi-stage build that produces a Next.js **standalone**
server (`output: "standalone"`), run as a non-root user on port **3000**.

```bash
docker build -t yellow-chat-frontend .
docker run -p 3000:3000 yellow-chat-frontend
```

In production it is built and served as the `frontend` service in the root
`docker-compose.yaml`, behind nginx (same-origin `/api` → backend).
