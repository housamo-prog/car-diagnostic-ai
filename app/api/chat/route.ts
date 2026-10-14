import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, carInfo } = await req.json();
    const carContext = carInfo ? `\nمعلومات السيارة: ${carInfo}` : "";

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [
        {
          role: "system",
          content: `أنت خبير ميكانيكي سيارات في سوريا والمنطقة العربية.
رد بالعربية. اذكر السبب المحتمل والقطعة المطلوبة إن وجدت.
ركز على السيارات المنتشرة في سوريا: كيا، هيونداي، شانجان، MG.
السيارات القديمة الشائعة: هيونداي أكسنت، كيا سيراتو.${carContext}`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" }, { status: 500 });
  }
}
