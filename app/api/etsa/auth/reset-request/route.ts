import { NextResponse } from "next/server";
import { z } from "zod";
import { requestCustomerPasswordReset } from "@/app/lib/etsa/auth";

const requestSchema = z.object({ email: z.email().max(320) });

export async function POST(request: Request) {
  const input = requestSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    const origin = new URL(request.url).origin;
    await requestCustomerPasswordReset(input.data.email.trim().toLowerCase(), `${origin}/reset-password`);
  } catch (error) {
    // Keep the response generic so this endpoint cannot reveal registered accounts.
    console.error("Customer password reset request failed", error);
  }

  return NextResponse.json({
    message: "If an account exists for that email, a secure reset link is on its way."
  });
}
