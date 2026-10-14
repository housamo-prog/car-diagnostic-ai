"use client";
import { useState, useEffect } from "react";

export default function RequestPage() {
  const [form, setForm] = useState({ partName: "", carModel: "", description: "" });
  const [requests, setRequests] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    const res = await fetch("/api/parts");
    const data = await res.json();
    setRequests(data.requests || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/parts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSubmitted(true);
      setForm({ partName: "", carModel: "", description: "" });
      fetchRequests();
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gray-50" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">🔩 طلب قطعة غيار</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded space-y-3 mb-6">
          <div>
            <label className="block font-bold mb-1">اسم القطعة *</label>
            <input
              type="text"
              required
              value={form.partName}
              onChange={(e) => setForm({ ...form, partName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">موديل السيارة *</label>
            <input
              type="text"
              required
              value={form.carModel}
              onChange={(e) => setForm({ ...form, carModel: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-bold mb-1">وصف إضافي</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </form>
      ) : (
        <div className="bg-green-100 p-4 rounded mb-4">
          ✅ تم تسجيل الطلب!
          <button onClick={() => setSubmitted(false)} className="mr-4 underline">
            تسجيل طلب آخر
          </button>
        </div>
      )}

      <h2 className="font-bold mb-2">الطلبات السابقة</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات</p>
      ) : (
        <div className="space-y-2">
          {requests.slice().reverse().map((r) => (
            <div key={r.id} className="bg-white p-3 rounded border">
              <div className="font-bold">{r.partName} - {r.carModel}</div>
              <div className="text-sm text-gray-500">{r.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
