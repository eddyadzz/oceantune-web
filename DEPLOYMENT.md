# Ocean Tune — VPS Deployment Guide

Production stack used by this guide:

- **PostgreSQL** on the VPS (database + Prisma)
- Code uploaded to `~/app/oceantune`, symlinked at `/var/www/oceantune`
- **nginx** with a **Cloudflare origin cert** at `/etc/nginx/ssl/`
- Next.js (`next start`) supervised by **PM2**
- Media/static uploads live in **R2 (mvcdn.cc)** — not on the VPS

The deployment here uses HTTPS direct to the origin via Cloudflare's Origin
Certificate (TLS Full/Strict), so your origin stays protected and no port 443
hits ever reach it bare.

> Next.js version is **13.5.1**. It does NOT use `output: 'standalone'`, so PM2
> runs `next start` (not `server.js`).

---

## 1. Server prerequisites

Debian/Ubuntu VPS, one deploy user (non-root). Example user: `deploy`.

```bash
# Node 20 (LTS) + npm — Next 13.5 targets <20; see SIGINT note below
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs nginx postgresql postgresql-contrib build-essential git

# PM2
sudo npm install -g pm2
```

Verify:

```bash
node -v   # v20.x
npm -v
```

> **Known noise:** on Node 20+ this project logs
> `ERR_INVALID_ARG_TYPE: The "code" argument must be of type number. Received 'SIGINT'`
> whenever the process is stopped (Ctrl+C, `pm2 restart`). It is a Next 13.5
> shutdown bug, fires only while terminating, is harmless, and will appear in
> `pm2 logs` during restarts. It does not affect uptime or data.

Open ports `80` and `443` in the firewall. For a locked-down origin you may
restrict them to Cloudflare's IP ranges, but a simple `ufw allow 80,443/tcp`
is fine.

---

## 2. PostgreSQL

```bash
sudo -u postgres psql
```

Inside `psql`:

```sql
CREATE USER oceantune WITH PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
CREATE DATABASE oceantune OWNER oceantune;
\q
```

Test the connection:

```bash
PGPASSWORD='CHANGE_ME_STRONG_PASSWORD' psql -h 127.0.0.1 -U oceantune -d oceantune -c 'SELECT 1;'
```

The app talks to PostgreSQL over `127.0.0.1` — no remote access needed.

---

## 3. Upload the app

Build/copy on your laptop, or clone directly on the server:

```bash
# From your machine (rsync preferred – excludes node_modules/.next)
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .env \
  -e ssh ./ deploy@srv:/home/deploy/app/oceantune

# or scp / git clone into ~/app/oceantune
```

Create the symlink that the user requested:

```bash
mkdir -p /var/www
sudo ln -sfn /home/deploy/app/oceantune /var/www/oceantune
```

Set the owner so nginx/pm2 (running as `deploy`) can read it:

```bash
sudo chown -R deploy:deploy /home/deploy/app/oceantune
```

---

## 4. Environment

Create `/var/www/oceantune/.env` (keep it chmod 600):

```bash
cd /var/www/oceantune
cp .env.example .env
chmod 600 .env
```

Fill it in:

```env
# Postgres (Prisma)
DATABASE_URL=postgresql://oceantune:CHANGE_ME_STRONG_PASSWORD@127.0.0.1:5432/oceantune

# Auth (NextAuth v4)
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://oceantune.com

# R2 Storage (mvcdn.cc) — same values as local
R2_ENDPOINT=https://cdn.mvcdn.cc/s3
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=oceantune-web-storage
R2_PUBLIC_URL=https://cdn.mvcdn.cc/s3/oceantune-web-storage
R2_ADMIN_URL=https://panel.mvcdn.cc

# Telegram contact-form notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# One-time seed admin (only used by `npm run db:seed`)
ADMIN_EMAIL=admin@oceantune.com
ADMIN_PASSWORD=CHANGE_ME_AFTER_FIRST_LOGIN
```

> `NEXTAUTH_URL` must be the public HTTPS origin. `images.unoptimized: true`
> means R2 URLs need no Next image-domain config.

---

## 5. Install, build, database

```bash
cd /var/www/oceantune
npm ci                  # or npm install if you have no lockfile
npm run build           # runs `prisma generate && next build`
```

The first build downloads the Prisma engine for the server's platform — this
requires outbound network.

Sync the schema and seed. **Note:** this repo has no `prisma/migrations`
directory, so we push the schema directly:

```bash
npm run db:push         # prisma db push
npm run db:seed         # prisma db seed  → seeds content + admin user
```

Verify the admin sign-in works before going further (credentials from
`ADMIN_EMAIL` / `ADMIN_PASSWORD` used at seed time).

> If you later add migrations, replace `prisma db push` with
> `npx prisma migrate deploy`.

---

## 6. PM2

The file `ecosystem.config.js` ships with the repo — just upload it (it ships
inside the app folder). No edits needed.

Start it and persist across reboots:

```bash
cd /var/www/oceantune
pm2 start ecosystem.config.js
pm2 save
pm2 startup                    # follow the printed systemd command, then run `pm2 save`
```

Check it is serving locally:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/   # 200
pm2 logs oceantune
```

---

## 7. Cloudflare origin certificate

Nginx sits behind Cloudflare and uses an **Origin Certificate** signed by
Cloudflare (valid ~15 years, directly supported with TLS Full/Strict).

1. Cloudflare dashboard → **SSL/TLS → Origin Server → Create Certificate**.
2. Choose 15-year validity, hostnames `oceantune.com` and `*.oceantune.com`.
3. Save the certificate chain as `/etc/nginx/ssl/origin.pem` and the private
   key as `/etc/nginx/ssl/origin.key` (upload via scp or paste in).

```bash
sudo mkdir -p /etc/nginx/ssl
sudo install -o root -g root -m 600 origin.key /etc/nginx/ssl/origin.key
sudo install -o root -g root -m 644 origin.pem /etc/nginx/ssl/origin.pem
```

Generating a self-signed fallback so nginx never refuses to start if the file
order matters (optional):

```bash
# skip this if you already placed the Cloudflare certs above
```

---

## 8. nginx site

Create `/etc/nginx/sites-available/oceantune`:

```nginx
upstream oceantune {
    server 127.0.0.1:3000;
    keepalive 32;
}

# HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name oceantune.com www.oceantune.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name oceantune.com www.oceantune.com;

    # Cloudflare origin cert
    ssl_certificate     /etc/nginx/ssl/origin.pem;
    ssl_certificate_key /etc/nginx/ssl/origin.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # Allow the 8 MB CMS uploads (plus multipart overhead)
    client_max_body_size 12M;

    # Static assets — immutable, long-cache
    location /_next/static/ {
        alias /var/www/oceantune/.next/static/;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    location / {
        proxy_pass http://oceantune;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Enable, test, reload:

```bash
sudo ln -sf /etc/nginx/sites-available/oceantune /etc/nginx/sites-enabled/oceantune
sudo rm -f /etc/nginx/sites-enabled/default   # if present
sudo nginx -t
sudo systemctl reload nginx
```

> Serving `/_next/static/` directly from disk keeps PM2 from handling static
> assets — make sure `/var/www/oceantune/.next/static` resolves through the
> symlink (it does).

---

## 9. Cloudflare DNS / SSL mode

1. **DNS**: add an `A` record for `oceantune.com` and `www` → VPS public IP,
   proxy status **Proxied** (orange cloud).
2. **SSL/TLS → Overview**: encryption mode **Full (strict)** — valid because we
   use the Cloudflare origin cert.

Then verify the site:

```bash
curl -I https://oceantune.com
```

---

## 10. Deploying updates

```bash
cd /var/www/oceantune

# upload new code (replace node_modules/.next stay behind)
rsync -az --delete --exclude node_modules --exclude .next --exclude .env \
  -e ssh ./ deploy@srv:/home/deploy/app/oceantune

npm ci
npm run build
pm2 restart oceantune
```

If the Prisma schema changed:

```bash
npm run db:push          # or: npx prisma migrate deploy once migrations exist
pm2 restart oceantune
```

Common commands:

```bash
pm2 status oceantune
pm2 logs oceantune --lines 100
pm2 restart oceantune
tail -f /var/log/nginx/error.log
```

---

## 11. Backups

Everything user-facing is a DB row or an R2 object, so only two things to back
up:

**Database** (daily cron):

```bash
pg_dump -h 127.0.0.1 -U oceantune -d oceantune -Fc -f /backups/oceantune_$(date +%F).dump
```

**R2 media** — lives in mvcdn.cc (`oceantune-web-storage` bucket), so it is
outside the VPS. Keep the bucket's keys safe; re-uploading media files is only
needed if the bucket is lost.

---

## 12. Troubleshooting quick hits

| Symptom | Likely cause | Fix |
|---|---|---|
| `503` from admin "Database not configured" | `DATABASE_URL` missing/wrong | check `.env`, `pm2 restart oceantune` |
| 400/502 on login, cookies not saved | `NEXTAUTH_URL` mismatch | set `https://oceantune.com` and restart |
| Upload works but image 404s | `R2_PUBLIC_URL` wrong | must be `https://cdn.mvcdn.cc/s3/oceantune-web-storage` |
| Contact form says "not configured" | `TELEGRAM_*` empty | add token + chat id, restart |
| `NoSuchKey` on Media Library | expected — storage can't list objects | library reads from DB; verify `MediaFile` rows exist |
| 413 on upload | nginx body limit | increase `client_max_body_size` (12M covers 8MB files) |