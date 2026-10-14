import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { messages, carInfo } = await req.json();
    const carContext = carInfo ? `\nمعلومات السيارة: ${carInfo}` : "";

    const systemInstruction = `أنت خبير ميكانيكي سيارات في سوريا والمنطقة العربية.
رد بالعربية. اذكر السبب المحتمل والقطعة المطلوبة إن وجدت.
ركز على السيارات المنتشرة في سوريا: كيا، هيونداي، شانجان، MG.
السيارات القديمة الشائعة: هيونداي أكسنت، كيا سيراتو.${carContext}`;

    // تحويل الرسائل لصيغة Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" },
      { status: 500 }
    );
  }
}
