# অর্ডার Google Sheet-এ জমা করা

১. Google Sheets-এ নতুন শিট খুলুন, নাম দিন "Ghorowa Orders"। প্রথম সারিতে এই কলামগুলো লিখুন:

```
id | createdAt | name | phone | address | zone | note | payment | bkashSender | bkashTrxId | items | subtotal | delivery | total | status
```

২. **Extensions → Apps Script** খুলে নিচের কোড বসান:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const o = JSON.parse(e.postData.contents);
  sheet.appendRow([
    o.id, o.createdAt, o.name, "'" + o.phone, o.address, o.zone, o.note,
    o.payment, o.bkashSender ? "'" + o.bkashSender : "", o.bkashTrxId,
    o.items, o.subtotal, o.delivery, o.total, "নতুন",
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

৩. **Deploy → New deployment → Web app** বেছে নিন।
   - Execute as: **Me**
   - Who has access: **Anyone**

৪. যে URL পাবেন (`https://script.google.com/macros/s/.../exec`) সেটা Vercel-এ `ORDER_WEBHOOK_URL` হিসেবে দিন।

এখন প্রতিটি অর্ডার শিটে নতুন সারি হিসেবে আসবে। `status` কলামে "কনফার্মড", "পাঠানো হয়েছে", "ডেলিভারড" লিখে অর্ডার ট্র্যাক করতে পারবেন।

> এই URL গোপন রাখুন — যার কাছে থাকবে সে শিটে সারি যোগ করতে পারবে।
