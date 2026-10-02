"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ETSA_QUESTIONS } from "@/app/lib/etsa/questions";
import { customerRequest } from "@/app/lib/customer-request";
import styles from "../etsa.module.css";

type SavedResponse={question_id:number;answer_value:unknown;answer_text:string|null};
const sectionNames:Record<number,string>={1:"Talent Inventory",2:"Behavioral Alignment",3:"Cognitive & Problem-Solving",4:"Workstyle & Operational Fit",5:"Applied Challenges"};

export default function EtsaAssessmentPage(){
  const router=useRouter();
  const [assessmentId,setAssessmentId]=useState("");
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<number,unknown>>({});
  const [textAnswers,setTextAnswers]=useState<Record<number,string>>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const q=ETSA_QUESTIONS[index];

  useEffect(()=>{let cancelled=false; (async()=>{
    try {
      const response=await customerRequest("/api/etsa/session");
      if(response.status===401){router.replace("/welcome?mode=login&next=/etsa/assessment");return;}
      const body=await response.json();
      if(!response.ok) throw new Error(body.error || "Unable to load your assessment.");
      if(!body.session){router.replace("/etsa/notice");return;}
      if(!["CREATED","IN_PROGRESS","PAUSED"].includes(body.session.status)){router.replace("/etsa/results");return;}
      if(cancelled)return;
      setAssessmentId(body.session.id);
      const values:Record<number,unknown>={}; const texts:Record<number,string>={};
      (body.responses as SavedResponse[]).forEach(r=>{values[r.question_id]=r.answer_value;if(r.answer_text)texts[r.question_id]=r.answer_text;});
      setAnswers(values); setTextAnswers(texts);
      const next=Math.max(1,Math.min(70,Number(body.session.current_question||1)));
      setIndex(next-1);
    } catch(error) { if(!cancelled)setError(error instanceof Error ? error.message : "Unable to load your assessment."); }
    finally { if(!cancelled)setLoading(false); }
  })(); return ()=>{cancelled=true;};},[router]);

  const currentValue=answers[q?.id];
  const currentText=textAnswers[q?.id]??"";
  const wordCount=useMemo(()=>currentText.trim()?currentText.trim().split(/\s+/).length:0,[currentText]);
  const answered=q ? (q.type==="text"||q.type==="challenge" ? currentText.trim().length>0 : q.type==="multi" ? Array.isArray(currentValue)&&currentValue.length>0 : currentValue!==undefined&&currentValue!==null) : false;

  async function save(questionId:number){
    if(!assessmentId || saving)return false;
    setSaving(true); setError("");
    try {
      const question=ETSA_QUESTIONS[questionId-1];
      const response=await customerRequest("/api/etsa/response",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({assessmentId,questionId,answerValue:answers[questionId]??null,answerText:(question.type==="text"||question.type==="challenge")?(textAnswers[questionId]??""):null})});
      const body=await response.json().catch(()=>({}));
      if(response.status===401){router.replace("/welcome?mode=login&next=/etsa/assessment");return false;}
      if(!response.ok)throw new Error(body.error||"Could not save response.");
      return true;
    } catch(error){setError(error instanceof Error ? error.message : "Could not save response.");return false;}
    finally {setSaving(false);}
  }
  async function next(){if(!answered||saving)return; if(await save(q.id) && index<69)setIndex(index+1);}
  async function back(){if(saving)return; if(answered && !await save(q.id))return;setIndex(Math.max(0,index-1));}
  async function submit(){
    if(!answered||saving||!await save(q.id))return;
    setSaving(true);
    try {
      const response=await customerRequest("/api/etsa/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({assessmentId})});
      const body=await response.json().catch(()=>({}));
      if(!response.ok){
        if(body.missing?.length){setIndex(body.missing[0]-1);throw new Error(`Complete the missing questions: ${body.missing.join(", ")}`);}
        throw new Error(body.error||"Submission failed.");
      }
      router.push("/etsa/results");
    } catch(error){setError(error instanceof Error ? error.message : "Submission failed.");}
    finally {setSaving(false);}
  }

  function choose(value:unknown){setAnswers(prev=>({...prev,[q.id]:value}));}
  function toggleMulti(value:string){const existing=Array.isArray(currentValue)?currentValue as string[]:[];choose(existing.includes(value)?existing.filter(v=>v!==value):[...existing,value]);}

  if(loading)return <main className={styles.shell}><div className={styles.wrap}><p className={styles.muted}>Loading ETSA™…</p></div></main>;

  if(!assessmentId)return <main className={styles.shell}><div className={styles.wrap}><p role="alert">{error}</p><button className={styles.button} onClick={()=>window.location.reload()}>RETRY ASSESSMENT</button></div></main>;

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Identify Your Thing™</div>
    <div className={styles.questionMeta}><span>Question {q.id} of 70</span><span>{Math.round((q.id/70)*100)}% complete</span></div>
    <div className={styles.progressTrack}><div className={styles.progressBar} style={{width:`${(q.id/70)*100}%`}}/></div>
    <div className={styles.card}>
      <div className={styles.sectionLabel}>Section {q.section} • {sectionNames[q.section]}</div>
      <h1 className={styles.question}>{q.prompt}</h1>
      {(q.type==="single"||q.type==="rating")&&<div className={styles.options}>{q.options?.map((option,i)=><label className={styles.option} key={option}><input type="radio" name={`q-${q.id}`} checked={currentValue===i} onChange={()=>choose(i)}/><span>{q.type==="rating"?`${option} ${i===0?"— low":i===4?"— high":""}`:option}</span></label>)}</div>}
      {q.type==="multi"&&<div className={styles.options}>{q.options?.map(option=><label className={styles.option} key={option}><input type="checkbox" checked={Array.isArray(currentValue)&&(currentValue as string[]).includes(option)} onChange={()=>toggleMulti(option)}/><span>{option}</span></label>)}</div>}
      {(q.type==="text"||q.type==="challenge")&&<div className={styles.field}><textarea value={currentText} onChange={e=>{const value=e.target.value;if(!q.maxWords||value.trim().split(/\s+/).filter(Boolean).length<=q.maxWords)setTextAnswers(prev=>({...prev,[q.id]:value}))}} placeholder="Your response…"/><div className={styles.wordCount}>{q.maxWords?`${wordCount} / ${q.maxWords} words`:`${wordCount} words`}</div></div>}
      {error&&<p className={styles.error}>{error}</p>}
      <div className={styles.nav}><button className={styles.secondary} disabled={index===0||saving} onClick={back}>BACK</button>{index<69?<button className={styles.button} disabled={!answered||saving} onClick={next}>{saving?"SAVING…":"SAVE & CONTINUE"}</button>:<button className={styles.button} disabled={!answered||saving} onClick={submit}>{saving?"SUBMITTING…":"SUBMIT ASSESSMENT"}</button>}</div>
      <div className={styles.saved}>{saving?"Saving your response…":"Your progress is saved as you continue."}</div>
    </div>
  </div></main>;
}
