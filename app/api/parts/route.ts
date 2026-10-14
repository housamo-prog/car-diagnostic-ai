import { NextRequest, NextResponse } from "next/server";

let partRequests: any[] = [];
let nextId = 1;

export async function GET() {
  return NextResponse.json({ requests: partRequests });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { partName, carModel, description } = body;

  if (!partName || !carModel) {
    return NextResponse.json({ error: "اسم القطعة والموديل مطلوبان" }, { status: 400 });
  }

  const newRequest = {
    id: nextId++,
    partName,
    carModel,
    description: description || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  partRequests.push(newRequest);

  return NextResponse.json({
    success: true,
    request: newRequest,
    message: "تم تسجيل الطلب",
  });
}
