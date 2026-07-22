# CHRONOS Worker

Live time endpoint. Replaces the retired GitHub Action that committed
time.txt every minute (which generated over 1,800 junk commits).

## Deploy (one time, about two minutes)

1. Cloudflare dashboard -> Workers & Pages -> Create -> Worker
2. Name it: chronos
3. Paste the contents of worker.js and click Deploy
4. Your endpoint: https://chronos.<your-subdomain>.workers.dev

Any AI session can fetch that URL for the exact current Central time,
to the second, with no commits and no delay.
