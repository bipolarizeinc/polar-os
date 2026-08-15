import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "@/app/lib/polar-founder-auth";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";

export async function GET() {
  try {
    const store = await cookies();
    const founder = await validateFounderSession(store.get(FOUNDER_COOKIE)?.value);
    if (!founder) return NextResponse.json({ error: "Founder authorization required." }, { status: 401 });
    const config = getSupabaseConfig();
    if (!config) throw new Error("ETSA reviewer storage is not configured.");

    const sessions = await supabaseRequest<Array<{id:string;user_id:string;status:string;submitted_at:string|null;assessment_version:string}>>(
      config,
      "etsa_assessment_sessions?status=eq.REVIEW_REQUIRED&select=id,user_id,status,submitted_at,assessment_version&order=submitted_at.asc"
    );
    const userIds = [...new Set(sessions.map(s=>s.user_id))];
    const profiles = userIds.length
      ? await supabaseRequest<Array<{user_id:string;full_name:string;preferred_name:string|null}>>(config, `etsa_profiles?user_id=in.(${userIds.join(",")})&select=user_id,full_name,preferred_name`)
      : [];
    const byUser = new Map(profiles.map(p=>[p.user_id,p]));
    return NextResponse.json({
      queue: sessions.map(s=>({ ...s, participant: byUser.get(s.user_id) ?? null }))
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Reviewer queue failed." }, { status: 500 });
  }
}
