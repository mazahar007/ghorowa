# ব্যাকআপ ও রিস্টোর

প্রতিদিন রাত ৩:১৭-এ (বাংলাদেশ সময়) GitHub নিজে থেকে পুরো ডাটাবেস (পণ্য, অর্ডার, কাস্টমার, ক্যাটাগরি)
আর সব পণ্যের ছবির একটা কপি নেয়। প্রতিটি কপি ৩০ দিন রাখা থাকে, তারপর আপনা-আপনি মুছে যায়।

ব্যাকআপ রাখা হয় আপনার প্রাইভেট GitHub repo-তে — repo-র অ্যাক্সেস যার আছে শুধু সে-ই দেখতে পারে।
`BACKUP_PASSPHRASE` দিলে ফাইলটা পাসওয়ার্ড দিয়ে এনক্রিপ্ট হয় (জোরালোভাবে সুপারিশ করা হয়, কারণ এতে ক্রেতাদের
ফোন নম্বর ও ঠিকানা থাকে)।

## একবারের সেটআপ

GitHub-এ `ghorowa` repo → **Settings → Secrets and variables → Actions → New repository secret**-এ এগুলো যোগ করুন:

| নাম | কোথা থেকে |
| --- | --- |
| `DATABASE_BACKUP_URL` | Supabase → **Connect** → **Session pooler** স্ট্রিং (পোর্ট **5432**, পাসওয়ার্ড বসিয়ে)। Vercel-এর `DATABASE_URL` (পোর্ট 6543) এখানে চলবে না। |
| `SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` কী |
| `BACKUP_PASSPHRASE` | নিজের বানানো একটা লম্বা পাসওয়ার্ড — **কোথাও লিখে রাখুন**, এটা হারালে ব্যাকআপ খোলা যাবে না |

তারপর repo → **Actions → Daily backup → Run workflow** চাপুন। কয়েক মিনিটে সবুজ টিক এলে সেটআপ ঠিক আছে।

## ব্যাকআপ নামানো

repo → **Actions → Daily backup** → যে দিনের ব্যাকআপ চান সেটায় ক্লিক → নিচে **Artifacts** থেকে
`ghorowa-backup-…` ডাউনলোড করুন।

ভেতরে থাকে:
- `database.dump` — পুরো ডাটাবেস (রিস্টোরের জন্য)
- `database.sql` — একই ডাটা সাধারণ SQL হিসেবে (যেকোনো টেক্সট এডিটরে খোলা যায়)
- `images/` — সব পণ্যের ছবি

এনক্রিপ্ট করা থাকলে খুলতে (Mac/Linux, বা Windows-এ Gpg4win দিয়ে):

```bash
gpg -d ghorowa-backup-XXXX.tar.gz.gpg > backup.tar.gz   # BACKUP_PASSPHRASE চাইবে
tar -xzf backup.tar.gz
```

## রিস্টোর (ডাটা ফেরত আনা বা অন্য সার্ভারে সরানো)

নতুন/খালি PostgreSQL ডাটাবেসে:

```bash
pg_restore --no-owner --no-privileges -d "নতুন-ডাটাবেসের-URL" database.dump
```

`schema "public" already exists` — এই একটা সতর্কবার্তা আসা স্বাভাবিক, ডাটা ঠিকমতোই ফেরত আসে।
এরপর Vercel-এ `DATABASE_URL` নতুন ডাটাবেসের ঠিকানায় বদলে দিন।

ছবি নতুন জায়গায় নিলে ডাটাবেসে ছবির লিংক বদলাতে:

```sql
UPDATE products SET images = array(
  SELECT replace(u, 'https://পুরনো.supabase.co/storage/v1/object/public/products/', 'https://নতুন-ঠিকানা/')
  FROM unnest(images) u
);
```

## হাতে ব্যাকআপ নেওয়া (নিজের কম্পিউটারে)

PostgreSQL ১৭-এর ক্লায়েন্ট টুল ইনস্টল থাকলে:

```bash
DATABASE_BACKUP_URL="..." SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." BACKUP_PASSPHRASE="..." scripts/backup.sh
```

ফাইল তৈরি হবে `backup/` ফোল্ডারে।
