# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Customer login (Shopify Customer Account API)

Shopify's Customer Account API rejects `localhost` as an OAuth redirect host. To develop the login flow we tunnel local dev through ngrok so Shopify sees a real public HTTPS URL on a stable domain.

### One-time setup

1. Install ngrok:
   ```bash
   brew install ngrok
   ```

2. Sign up for a free account at https://ngrok.com.

3. From the ngrok dashboard, copy your auth token and configure it locally:
   ```bash
   ngrok config add-authtoken <your-auth-token>
   ```

4. In the ngrok dashboard, go to **Cloud Edge → Domains** and click **+ Create Domain**. The free tier includes one static domain like `<yourname>.ngrok-free.app`. Reserve it.

5. In Shopify admin → Apps & sales channels → Headless → your storefront → Customer Account API, set (using your reserved ngrok domain):
   - **Callback URI**: `https://<yourname>.ngrok-free.app/api/auth/callback`
   - **JavaScript origin**: `<yourname>.ngrok-free.app` (hostname only — no `https://`, no port)
   - **Logout URI**: `https://<yourname>.ngrok-free.app/`

   Save. Because the ngrok domain is stable, this is a one-time setup — no re-paste each session.

### Each dev session

1. Start the dev server:
   ```bash
   npm run dev
   ```
   It runs on `https://localhost:3000` (self-signed cert).

2. In a second terminal, start the tunnel:
   ```bash
   ngrok http https://localhost:3000 --domain=<yourname>.ngrok-free.app
   ```

3. Open `https://<yourname>.ngrok-free.app` in the browser (not `localhost:3000`) and click Login.

### Why we tunnel `https://localhost:3000`

Our local dev server uses a self-signed cert (see `.certs/`). ngrok handles the upstream HTTPS automatically. If you ever switch the dev server to plain HTTP, change the command to `ngrok http 3000`.

### Fallback: Cloudflare quick tunnel

For a quick test without signing up for ngrok:

```bash
brew install cloudflared
cloudflared tunnel --url https://localhost:3000 --no-tls-verify
```

Cloudflared prints a random `*.trycloudflare.com` URL each time. You'd update the three Shopify fields with that URL each session. **Caveat:** Shopify may reject `*.trycloudflare.com` as a callback host (treats shared-tunnel domains as untrustworthy) — if validation says "not valid", use ngrok instead.

