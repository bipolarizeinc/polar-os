import { NextResponse } from "next/server";
import { z } from "zod";
import { CustomerAuthError, updateCustomerPassword } from "@/app/lib/etsa/auth";

const confirmationSchema = z.object({
  accessToken: z.string().min(20).max(4_000),
  password: z.string().min(8).max(200)
});

export async function POST(request: Request) {
  const input = confirmationSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: "The reset link or new password is invalid." }, { status: 400 });
  }

  try {
    await updateCustomerPassword(input.data.accessToken, input.data.password);
    return NextResponse.json({ message: "Password updated. You can now sign in." });
  } catch (error) {
    const status = error instanceof CustomerAuthError && error.status < 500 ? 400 : 502;
    return NextResponse.json(
      { error: status === 400 ? "This reset link is invalid or has expired." : "Password recovery is temporarily unavailable." },
      { status }
    );
  }
}
