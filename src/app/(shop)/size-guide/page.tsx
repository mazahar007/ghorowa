import type { Metadata } from "next";

export const metadata: Metadata = { title: "সাইজ গাইড" };

// ⚠ নমুনা মাপ — আপনার পোশাকের আসল মাপ দিয়ে বদলান (ইঞ্চি)
const rows = [
  { size: "0-3M", age: "০–৩ মাস", height: "২১–২৪", chest: "১৬" },
  { size: "3-6M", age: "৩–৬ মাস", height: "২৪–২৬", chest: "১৭" },
  { size: "6-9M", age: "৬–৯ মাস", height: "২৬–২৮", chest: "১৮" },
  { size: "9-12M", age: "৯–১২ মাস", height: "২৮–৩০", chest: "১৮.৫" },
  { size: "2Y", age: "১–২ বছর", height: "৩১–৩৪", chest: "২০" },
  { size: "3Y", age: "২–৩ বছর", height: "৩৪–৩৮", chest: "২১" },
  { size: "4Y", age: "৩–৪ বছর", height: "৩৮–৪১", chest: "২২" },
  { size: "5Y", age: "৪–৫ বছর", height: "৪১–৪৪", chest: "২৩" },
  { size: "6Y", age: "৫–৬ বছর", height: "৪৪–৪৬", chest: "২৪" },
  { size: "7Y", age: "৬–৭ বছর", height: "৪৬–৪৯", chest: "২৪.৫" },
  { size: "8Y", age: "৭–৮ বছর", height: "৪৯–৫১", chest: "২৫" },
  { size: "9Y", age: "৮–৯ বছর", height: "৫১–৫৩", chest: "২৬" },
  { size: "10Y", age: "৯–১০ বছর", height: "৫৩–৫৫", chest: "২৭" },
  { size: "11Y", age: "১০–১১ বছর", height: "৫৫–৫৮", chest: "২৮" },
  { size: "12Y", age: "১১–১২ বছর", height: "৫৮–৬০", chest: "২৯" },
];

export default function SizeGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-bangla text-3xl font-bold">সাইজ গাইড</h1>
      <p className="mb-6 mt-2 text-soft">
        বাচ্চার উচ্চতা মেপে সাইজ বেছে নিন। দুই সাইজের মাঝামাঝি হলে বড় সাইজটা নিন। মাপ ইঞ্চিতে।
      </p>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[480px] text-left">
          <thead className="bg-cream">
            <tr>
              <th scope="col" className="px-4 py-3">সাইজ</th>
              <th scope="col" className="px-4 py-3">বয়স</th>
              <th scope="col" className="px-4 py-3">উচ্চতা</th>
              <th scope="col" className="px-4 py-3">বুক</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-t border-line">
                <td className="px-4 py-3 font-bold">{r.size}</td>
                <td className="px-4 py-3">{r.age}</td>
                <td className="px-4 py-3">{r.height}</td>
                <td className="px-4 py-3">{r.chest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
