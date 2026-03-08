# 🔐 JEAN OFFICIAL — SECURE DEPLOY

## Password Default
```
jean2025
```

## Cara Ganti Password
1. Buka file `index.html`
2. Cari baris: `const PASS_HASH = '...'`
3. Ganti hash dengan SHA256 dari password baru kamu
4. Generate hash: https://emn178.github.io/online-tools/sha256.html

## Perlindungan yang Aktif

### Layer 1 — Middleware (Server Side)
- Block wget, curl, python-requests, Ganz_Track, dan 20+ bot lainnya
- Block User-Agent kosong
- Block scraper headless (Puppeteer, Selenium, Playwright)
- Security headers otomatis

### Layer 2 — Password Gate (Client Side)
- Password di-hash SHA-256 (tidak ada plain text di kode)
- Konten website di-encode XOR+Base64
- Bot yang berhasil bypass middleware hanya dapat halaman password kosong
- File HTML asli TIDAK ADA di server — hanya encoded data
- Konten di-decode di memory browser HANYA setelah password benar
- 5x salah password → kunci 30 detik

### Layer 3 — Anti Inspect
- Block F12, Ctrl+Shift+I, Ctrl+U
- DevTools size detection → halaman blank
- Debugger trap setiap 3 detik
- Console warning

## Kenapa Bot Tidak Bisa Ambil Konten?
Bot seperti Ganz_Track pakai `/gethtml [url]` → request HTTP biasa.
Middleware langsung block → dapat response `403 ACCESS DENIED`.
Bahkan kalau lolos middleware, yang diterima hanya password gate.
Konten asli TIDAK ADA di file HTML server — tersimpan encoded di memory.

## Files
- `index.html` — Password gate + konten terenkripsi
- `middleware.js` — Bot blocker server-side
- `vercel.json` — Konfigurasi Vercel
