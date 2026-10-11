"use client";

import { refreshCourierStatus, sendToSteadfast, updateOrder } from "../../../actions";
import { FormMessage, SubmitButton, TextArea, inputClass, useFormAction } from "@/components/forms";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/labels";

export function OrderUpdateForm({ id, status, paymentStatus, adminNote }: { id: number; status: string; paymentStatus: string; adminNote: string }) {
  const { state, onSubmit, pending } = useFormAction(updateOrder);
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">অর্ডার স্ট্যাটাস</span>
        <select name="status" defaultValue={status} className={`${inputClass} h-12`}>
          {Object.entries(orderStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="font-semibold">পেমেন্ট স্ট্যাটাস</span>
        <select name="paymentStatus" defaultValue={paymentStatus} className={`${inputClass} h-12`}>
          {Object.entries(paymentStatusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <TextArea label="নিজের নোট (ক্রেতা দেখবে না)" name="adminNote" defaultValue={adminNote} rows={3} />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>সেভ করুন</SubmitButton>
    </form>
  );
}

export function CourierPanel({ id, booked, enabled }: { id: number; booked: boolean; enabled: boolean }) {
  const sendForm = useFormAction(sendToSteadfast);
  const refreshForm = useFormAction(refreshCourierStatus);
  if (!enabled) {
    return <p className="text-sm text-muted">Steadfast চালু করতে STEADFAST_API_KEY ও STEADFAST_SECRET_KEY সেট করুন (README দেখুন)।</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {!booked ? (
        <form onSubmit={sendForm.onSubmit} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={id} />
          <SubmitButton pending={sendForm.pending}>Steadfast-এ পার্সেল বুক করুন</SubmitButton>
        </form>
      ) : (
        <form onSubmit={refreshForm.onSubmit} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={id} />
          <SubmitButton variant="secondary" pending={refreshForm.pending}>কুরিয়ার স্ট্যাটাস রিফ্রেশ</SubmitButton>
        </form>
      )}
      <FormMessage state={sendForm.state ?? refreshForm.state} />
    </div>
  );
}
