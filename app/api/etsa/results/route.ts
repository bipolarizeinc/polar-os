import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getEtsaUser } from "@/app/lib/etsa/auth";
import { etsaRest } from "@/app/lib/etsa/data";

export async function GET(){
  try{
    const store=await cookies();
    const token=store.get("etsa_access")?.value;
    if(!token)return NextResponse.json({error:"Authentication required."},{status:401});
    const user=await getEtsaUser(token);
    const sessions=await etsaRest<Array<{id:string;status:string;assessment_version:string;completed_at:string|null;started_at:string}>>(`etsa_assessment_sessions?user_id=eq.${user.id}&assessment_version=eq.ETSA-1.0&order=started_at.asc&select=id,status,assessment_version,completed_at,started_at`,token);
    if(!sessions.length)return NextResponse.json({session:null,report:null,attemptNumber:0,locked:false});
    const session=sessions[sessions.length-1];
    const attemptNumber=sessions.length;
    const locked=attemptNumber>1;

    if(session.status!=="COMPLETE")return NextResponse.json({session,report:null,attemptNumber,locked:false});

    if(locked){
      return NextResponse.json({
        session,
        report:null,
        attemptNumber,
        locked:true,
        unlockPath:"/etsa/unlock",
        message:"Your ETSA reassessment is complete. Your updated profile and corresponding paperwork are ready to unlock."
      });
    }

    const results=await etsaRest<Array<{id:string}>>(`etsa_results?assessment_id=eq.${session.id}&user_id=eq.${user.id}&select=id&limit=1`,token);
    const result=results[0];
    if(!result)return NextResponse.json({session,report:null,attemptNumber,locked:false});
    const reports=await etsaRest<Array<{report:Record<string,unknown>;generated_at:string}>>(`etsa_candidate_reports?result_id=eq.${result.id}&user_id=eq.${user.id}&select=report,generated_at&limit=1`,token);
    return NextResponse.json({session,report:reports[0]?.report??null,generatedAt:reports[0]?.generated_at??null,attemptNumber,locked:false});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Unable to load ETSA result."},{status:500});
  }
}
