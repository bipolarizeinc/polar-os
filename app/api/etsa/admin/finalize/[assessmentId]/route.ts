import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FOUNDER_COOKIE, validateFounderSession } from "@/app/lib/polar-founder-auth";
import { getSupabaseConfig, supabaseRequest } from "@/app/lib/polar-memory";
import { scoreEtsaAssessment } from "@/app/lib/etsa/engine";

export async function POST(_:Request, context:{params:Promise<{assessmentId:string}>}){
  try{
    const store=await cookies();
    const founder=await validateFounderSession(store.get(FOUNDER_COOKIE)?.value);
    if(!founder)return NextResponse.json({error:"Founder authorization required."},{status:401});
    const config=getSupabaseConfig();
    if(!config)throw new Error("ETSA result storage is not configured.");
    const {assessmentId}=await context.params;
    const sessions=await supabaseRequest<Array<{id:string;user_id:string;assessment_version:string;status:string}>>(config,`etsa_assessment_sessions?id=eq.${assessmentId}&select=id,user_id,assessment_version,status&limit=1`);
    const session=sessions[0];
    if(!session)return NextResponse.json({error:"Assessment not found."},{status:404});
    const [responses,reviews]=await Promise.all([
      supabaseRequest<Array<{question_id:number;answer_value:unknown;answer_text:string|null}>>(config,`etsa_responses?assessment_id=eq.${assessmentId}&order=question_id.asc&select=question_id,answer_value,answer_text`),
      supabaseRequest<Array<{question_id:number;score:number;notes:string|null}>>(config,`etsa_review_scores?assessment_id=eq.${assessmentId}&reviewer_id=eq.${founder.id}&order=question_id.asc&select=question_id,score,notes`)
    ]);
    const required=[66,67,68,69,70];
    const reviewed=new Set(reviews.map(r=>r.question_id));
    const missing=required.filter(q=>!reviewed.has(q));
    if(missing.length)return NextResponse.json({error:"All applied challenges must be scored before finalization.",missing},{status:400});
    if(responses.length<70)return NextResponse.json({error:"Assessment response set is incomplete."},{status:400});

    const result=scoreEtsaAssessment(responses,reviews);
    const resultRows=await supabaseRequest<Array<{id:string}>>(config,"etsa_results?on_conflict=assessment_id",{
      method:"POST",
      headers:{Prefer:"resolution=merge-duplicates,return=representation"},
      body:JSON.stringify({
        assessment_id:assessmentId,user_id:session.user_id,assessment_version:session.assessment_version,scoring_engine_version:"ETSA-1.0",
        dimension_scores:result.dimensionScores,layer_scores:result.layerScores,department_scores:result.departmentScores,evidence_confidence:result.evidenceConfidence,
        readiness_level:result.readiness,primary_archetype:result.archetype,development_priority:result.developmentPriority,internal_flags:result.internalFlags
      })
    });
    const resultId=resultRows[0]?.id;
    if(!resultId)throw new Error("ETSA result record was not created.");
    await Promise.all([
      supabaseRequest(config,"etsa_candidate_reports?on_conflict=result_id",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify({result_id:resultId,user_id:session.user_id,report:result.candidateReport})}),
      supabaseRequest(config,"etsa_internal_reports?on_conflict=result_id",{method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify({result_id:resultId,user_id:session.user_id,report:result.internalReport,review_status:"COMPLETE"})}),
      supabaseRequest(config,`etsa_assessment_sessions?id=eq.${assessmentId}`,{method:"PATCH",body:JSON.stringify({status:"COMPLETE",completed_at:new Date().toISOString(),current_question:70})})
    ]);
    return NextResponse.json({ok:true,resultId,candidateReport:result.candidateReport});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"ETSA finalization failed."},{status:500});
  }
}
