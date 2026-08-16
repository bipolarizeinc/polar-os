"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ETSA_QUESTIONS } from "@/app/lib/etsa/questions";

type ResponseRow={question_id:number;answer_value:unknown;answer_text:string|null};
type ScoreRow={question_id:number;score:number;notes:string|null};
type ReviewPayload={
  participant?:{preferred_name?:string|null;full_name?:string|null};
  session:{assessment_version:string};
  responses:ResponseRow[];
  scores:ScoreRow[];
  error?:string;
};

export default function EtsaReviewPage(){
  const params=useParams<{assessmentId:string}>(); const assessmentId=params.assessmentId; const router=useRouter();
  const [data,setData]=useState<ReviewPayload|null>(null); const [scores,setScores]=useState<Record<number,number>>({}); const [notes,setNotes]=useState<Record<number,string>>({}); const [error,setError]=useState(""); const [saving,setSaving]=useState<number|null>(null); const [finalizing,setFinalizing]=useState(false);
  useEffect(()=>{(async()=>{const r=await fetch(`/api/etsa/admin/review/${assessmentId}`);const b=await r.json().catch(()=>({}));if(!r.ok){setError(b.error||"Unable to load review.");return;}setData(b);const s:Record<number,number>={};const n:Record<number,string>={};(b.scores as ScoreRow[]).forEach(x=>{s[x.question_id]=x.score;n[x.question_id]=x.notes||""});setScores(s);setNotes(n);})();},[assessmentId]);
  const responses=useMemo(()=>new Map<number,ResponseRow>((data?.responses||[]).map((r:ResponseRow)=>[r.question_id,r])),[data]);
  const allScored=[66,67,68,69,70].every(id=>scores[id]!==undefined);
  async function save(questionId:number){setSaving(questionId);setError("");const r=await fetch(`/api/etsa/admin/review/${assessmentId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({questionId,score:scores[questionId],notes:notes[questionId]||""})});const b=await r.json().catch(()=>({}));setSaving(null);if(!r.ok)setError(b.error||"Could not save score.");}
  async function finalize(){setFinalizing(true);setError("");for(const id of [66,67,68,69,70]){if(scores[id]===undefined)continue;const r=await fetch(`/api/etsa/admin/review/${assessmentId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({questionId:id,score:scores[id],notes:notes[id]||""})});if(!r.ok){const b=await r.json().catch(()=>({}));setError(b.error||`Could not save Question ${id}.`);setFinalizing(false);return;}}const r=await fetch(`/api/etsa/admin/finalize/${assessmentId}`,{method:"POST"});const b=await r.json().catch(()=>({}));setFinalizing(false);if(!r.ok){setError(b.error||"Could not finalize ETSA result.");return;}router.push("/admin/etsa");}
  if(error&&!data)return <main style={{padding:40,background:"#07090c",color:"#ff9a78",minHeight:"100vh"}}>{error}</main>;
  if(!data)return <main style={{padding:40,background:"#07090c",color:"white",minHeight:"100vh"}}>Loading ETSA review…</main>;
  return <main style={{minHeight:"100vh",background:"#07090c",color:"#f5f7fa",padding:"40px 20px 80px"}}><div style={{width:"min(980px,100%)",margin:"0 auto"}}>
    <p style={{letterSpacing:".16em",textTransform:"uppercase",fontSize:12,color:"#8f9aa5"}}>BPEI INTERNAL • ETSA™ PILOT REVIEW</p>
    <h1 style={{fontSize:"clamp(2rem,5vw,4rem)",margin:"8px 0"}}>{data.participant?.preferred_name||data.participant?.full_name||"Participant"}</h1>
    <p style={{color:"#9aa5af"}}>Assessment {assessmentId} • {data.session.assessment_version}</p>
    {error&&<p style={{color:"#ff9a78"}}>{error}</p>}
    <div style={{display:"grid",gap:22,marginTop:30}}>{[66,67,68,69,70].map(id=>{const q=ETSA_QUESTIONS[id-1];const response=responses.get(id);return <section key={id} style={{padding:24,border:"1px solid rgba(255,255,255,.12)",borderRadius:18,background:"rgba(255,255,255,.025)"}}>
      <div style={{color:"#00d9ef",fontSize:12,letterSpacing:".12em"}}>QUESTION {id}</div><h2 style={{lineHeight:1.3}}>{q.prompt}</h2><div style={{whiteSpace:"pre-wrap",lineHeight:1.7,color:"#d2d8de",padding:"16px 0"}}>{response?.answer_text||"No written response."}</div>
      <label style={{display:"grid",gap:8,marginTop:12}}><span>Score 0–5</span><select value={scores[id]??""} onChange={e=>setScores(p=>({...p,[id]:Number(e.target.value)}))} style={{padding:12,borderRadius:10,background:"#0b0f14",color:"white",border:"1px solid #333"}}><option value="" disabled>Select score</option>{[0,1,2,3,4,5].map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label style={{display:"grid",gap:8,marginTop:12}}><span>Reviewer notes</span><textarea value={notes[id]||""} onChange={e=>setNotes(p=>({...p,[id]:e.target.value}))} style={{minHeight:90,padding:12,borderRadius:10,background:"#0b0f14",color:"white",border:"1px solid #333"}}/></label>
      <button onClick={()=>save(id)} disabled={scores[id]===undefined||saving===id||finalizing} style={{marginTop:14,padding:"11px 16px",borderRadius:999,border:0,fontWeight:800,cursor:"pointer"}}>{saving===id?"SAVING…":"SAVE SCORE"}</button>
    </section>})}</div>
    <section style={{marginTop:28,padding:24,border:"1px solid rgba(0,229,255,.3)",borderRadius:18,background:"rgba(0,229,255,.04)"}}><h2>Finalize ETSA Result</h2><p style={{color:"#aab3bc",lineHeight:1.6}}>Finalization locks the pilot review into the ETSA-1.0 result engine, creates the candidate-facing profile and internal alignment report, and changes the assessment status to COMPLETE.</p><button onClick={finalize} disabled={!allScored||finalizing} style={{padding:"14px 20px",borderRadius:999,border:0,fontWeight:900,cursor:allScored?"pointer":"not-allowed"}}>{finalizing?"FINALIZING…":"FINALIZE & GENERATE REPORTS"}</button></section>
  </div></main>;
}
