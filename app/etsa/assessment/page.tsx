"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ETSA_QUESTIONS } from "@/app/lib/etsa/questions";
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

  useEffect(()=>{(async()=>{
    const response=await fetch("/api/etsa/session");
    if(response.status===401){router.replace("/etsa/login");return;}
    const body=await response.json();
    if(!body.session){router.replace("/etsa/notice");return;}
    setAssessmentId(body.session.id);
    const values:Record<number,unknown>={}; const texts:Record<number,string>={};
    (body.responses as SavedResponse[]).forEach(r=>{values[r.question_id]=r.answer_value;if(r.answer_text)texts[r.question_id]=r.answer_text;});
    setAnswers(values); setTextAnswers(texts);
    const next=Math.max(1,Math.min(70,Number(body.session.current_question||1)));
    setIndex(next-1); setLoading(false);
  })();},[router]);

  const currentValue=answers[q?.id];
  const currentText=textAnswers[q?.id]??"";
  const wordCount=useMemo(()=>currentText.trim()?currentText.trim().split(/\s+/).length:0,[currentText]);
  const answered=q ? (q.type==="text"||q.type==="challenge" ? currentText.trim().length>0 : q.type==="multi" ? Array.isArray(currentValue)&&currentValue.length>0 : currentValue!==undefined&&currentValue!==null) : false;

  async function save(questionId:number){
    if(!assessmentId)return false; setSaving(true); setError("");
    const question=ETSA_QUESTIONS[questionId-1];
    const response=await fetch("/api/etsa/response",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({assessmentId,questionId,answerValue:answers[questionId]??null,answerText:(question.type==="text"||question.type==="challenge")?(textAnswers[questionId]??""):null})});
    setSaving(false);
    if(!response.ok){const body=await response.json().catch(()=>({}));setError(body.error||"Could not save response.");return false;}
    return true;
  }

  async function next(){if(!answered)return;const ok=await save(q.id);if(!ok)return;if(index<69)setIndex(index+1);}
  async function submit(){if(!answered)return;const ok=await save(q.id);if(!ok)return;setSaving(true);const response=await fetch("/api/etsa/submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({assessmentId})});const body=await response.json().catch(()=>({}));setSaving(false);if(!response.ok){setError(body.missing?.length?`Complete all questions before submitting. Missing: ${body.missing.join(", ")}`:(body.error||"Submission failed."));return;}router.push("/etsa/results");}

  function choose(value:unknown){setAnswers(prev=>({...prev,[q.id]:value}));}
  function toggleMulti(value:string){const existing=Array.isArray(currentValue)?currentValue as string[]:[];choose(existing.includes(value)?existing.filter(v=>v!==value):[...existing,value]);}

  if(loading)return <main className={styles.shell}><div className={styles.wrap}><p className={styles.muted}>Loading ETSA™…</p></div></main>;

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
      <div className={styles.nav}><button className={styles.secondary} disabled={index===0||saving} onClick={()=>setIndex(Math.max(0,index-1))}>BACK</button>{index<69?<button className={styles.button} disabled={!answered||saving} onClick={next}>{saving?"SAVING…":"SAVE & CONTINUE"}</button>:<button className={styles.button} disabled={!answered||saving} onClick={submit}>{saving?"SUBMITTING…":"SUBMIT ASSESSMENT"}</button>}</div>
      <div className={styles.saved}>{saving?"Saving your response…":"Your progress is saved as you continue."}</div>
    </div>
  </div></main>;
}
