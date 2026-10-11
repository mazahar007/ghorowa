#!/usr/bin/env bash
# ডাটাবেস ও পণ্যের ছবির ব্যাকআপ তৈরি করে backup/ ফোল্ডারে।
#   DATABASE_BACKUP_URL  — Supabase "Session pooler" কানেকশন স্ট্রিং (পোর্ট 5432)
#   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — থাকলে ছবিও নামায়
#   BACKUP_PASSPHRASE    — থাকলে পুরো ব্যাকআপ পাসওয়ার্ড দিয়ে এনক্রিপ্ট করে (.gpg)
set -euo pipefail

: "${DATABASE_BACKUP_URL:?DATABASE_BACKUP_URL is not set}"
stamp=$(date -u +%Y-%m-%d_%H%M)
work=$(mktemp -d)
mkdir -p backup

echo "→ Dumping database (public schema)…"
pg_dump "$DATABASE_BACKUP_URL" --schema=public --no-owner --no-privileges --format=custom --file "$work/database.dump"
# the same data as plain SQL, readable in any text editor or SQL tool
pg_dump "$DATABASE_BACKUP_URL" --schema=public --no-owner --no-privileges --format=plain --file "$work/database.sql"

if [[ -n "${SUPABASE_URL:-}" && -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]]; then
  echo "→ Downloading product images…"
  node scripts/backup-images.mjs "$work/images"
fi

archive="backup/ghorowa-backup-$stamp.tar.gz"
tar -czf "$archive" -C "$work" .
rm -rf "$work"

if [[ -n "${BACKUP_PASSPHRASE:-}" ]]; then
  echo "→ Encrypting…"
  gpg --batch --yes --pinentry-mode loopback --passphrase "$BACKUP_PASSPHRASE" --symmetric --cipher-algo AES256 -o "$archive.gpg" "$archive"
  rm "$archive"
  archive="$archive.gpg"
fi

echo "✓ Backup ready: $archive ($(du -h "$archive" | cut -f1))"
