"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type QueueItem={id:string;status:string;submitted_at:string|null;assessment_version:string;participant:{full_name:string;preferred_name:string|null}|null};

export default function EtsaAdminPage(){
  const [queue,setQueue]=useState<QueueItem[]>([]); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const r=await fetch("/api/etsa/admin/queue");const b=await r.json().catch(()=>({}));setLoading(false);if(!r.ok){setError(b.error||"Unable to load ETSA queue.");return;}setQueue(b.queue||[]);})();},[]);
  return <main style={{minHeight:"100vh",background:"#07090c",color:"#f5f7fa",padding:"48px 20px"}}><div style={{width:"min(1000px,100%)",margin:"0 auto"}}>
    <p style={{letterSpacing:".18em",textTransform:"uppercase",color:"#8f9aa5",fontSize:12}}>BPEI INTERNAL • ETSA™ REVIEW</p>
    <h1 style={{fontSize:"clamp(2rem,6vw,4.5rem)",margin:"8px 0 12px"}}>Pilot Review Queue</h1>
    <p style={{color:"#aab3bc"}}>Applied Challenges 66–70 require human scoring before ETSA v1.0 results are finalized.</p>
    {loading&&<p>Loading…</p>}{error&&<p style={{color:"#ff9a78"}}>{error}</p>}
    <div style={{display:"grid",gap:12,marginTop:28}}>{queue.map(item=><Link key={item.id} href={`/admin/etsa/${item.id}`} style={{display:"block",padding:20,border:"1px solid rgba(255,255,255,.12)",borderRadius:16,color:"inherit",textDecoration:"none",background:"rgba(255,255,255,.03)"}}><strong>{item.participant?.preferred_name||item.participant?.full_name||"Participant"}</strong><div style={{color:"#8f9aa5",marginTop:6}}>{item.assessment_version} • {item.submitted_at?new Date(item.submitted_at).toLocaleString():"Submitted"}</div></Link>)}</div>
    {!loading&&!error&&!queue.length&&<p style={{marginTop:28,color:"#8f9aa5"}}>No assessments are waiting for review.</p>}
  </div></main>;
}
