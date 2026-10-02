import { redirect } from "next/navigation";
import { customerDestination } from "@/app/lib/customer-navigation";

export default async function EtsaLoginPage({ searchParams }: { searchParams: Promise<{ next?: string; mode?: string }> }) {
  const params = await searchParams;
  const query = new URLSearchParams({ next: customerDestination(params.next, "/etsa/notice"), mode: params.mode === "register" ? "register" : "login" });
  redirect(`/welcome?${query}`);
}
