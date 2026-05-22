# BTC Ballers - btcballers.fit

Static Next.js 14 site for BTC Ballers basketball training in Dallas.

## Stack
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Vercel (deploy)

## No backend
v1 is static. Contact is mailto: only. No database. No env vars. No API keys.

## Local dev
```bash
npm install
npm run dev
```

## Deploy
```bash
git push origin main
vercel --prod
```

## Updating camp availability
Edit `src/lib/programs.ts` -> `campWeeks` array -> change `spotsLeft` for the week that filled. Commit and push.
