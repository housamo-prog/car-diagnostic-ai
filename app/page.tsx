"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [carInfo, setCarInfo] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, carInfo }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply || data.error }]);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gray-50" dir="rtl">
      <h1 className="text-2xl font-bold mb-2 text-center">🔧 خبير السيارات الذكي</h1>
      <p className="text-center text-gray-500 mb-4 text-sm">تشخيص أعطال السيارات في سوريا والمنطقة العربية</p>

      <input
        type="text"
        placeholder="اكتب موديل سيارتك (اختياري): كيا سورينتو 2015"
        value={carInfo}
        onChange={(e) => setCarInfo(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="bg-white rounded p-4 h-96 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            اكتب مشكلة سيارتك وسأساعدك في تشخيصها
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block p-3 rounded-lg max-w-[85%] ${
                m.role === "user" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <div className="text-xs font-bold mb-1">
                {m.role === "user" ? "أنت" : "الخبير"}
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && <p className="text-gray-400 text-center">جاري التفكير...</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="اكتب مشكلة سيارتك..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
