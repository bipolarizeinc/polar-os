import { NextResponse } from "next/server";
import { reviewerOperation } from "@/app/lib/etsa/reviewer";

export async function GET() {
  try {
    const result = await reviewerOperation("queue");
    return NextResponse.json(result.data ?? { error: result.error }, { status: result.status, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("ETSA reviewer queue unavailable", error);
    return NextResponse.json({ error: "Reviewer queue is temporarily unavailable." }, { status: 503 });
  }
}
