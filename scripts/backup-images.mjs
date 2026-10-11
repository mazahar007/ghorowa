// Supabase Storage-এর "products" বাকেটের সব ছবি নামিয়ে দেয়।
// ব্যবহার: node scripts/backup-images.mjs <out-dir>
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const out = process.argv[2];
const bucket = "products";
if (!base || !key || !out) throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and an output dir are required");
const headers = { Authorization: `Bearer ${key}`, apikey: key };

async function list(prefix) {
  const names = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${base}/storage/v1/object/list/${bucket}`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: "name", order: "asc" } }),
    });
    if (!res.ok) throw new Error(`list failed: ${res.status} ${await res.text()}`);
    const page = await res.json();
    for (const item of page) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      // folders come back without an id
      if (item.id === null || item.id === undefined) names.push(...(await list(full)));
      else names.push(full);
    }
    if (page.length < 1000) return names;
  }
}

const names = await list("");
await mkdir(out, { recursive: true });
let done = 0;
for (const name of names) {
  const res = await fetch(`${base}/storage/v1/object/${bucket}/${name}`, { headers });
  if (!res.ok) throw new Error(`download failed for ${name}: ${res.status}`);
  const file = path.join(out, name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  done++;
}
console.log(`✓ ${done} images downloaded`);
