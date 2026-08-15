"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../etsa.module.css";

type CandidateReport={
  assessmentVersion:string;
  talentArchetype:string;
  yourThing:string|null;
  dimensionScores:Record<string,number>;
  topStrengths:string[];
  departmentAlignments:Array<{department:string;score:number}>;
  readinessLevel:string;
  developmentPriority:string;
  evidenceConfidence:Record<string,string>;
};

const dimensionNames:Record<string,string>={SI:"Strategic Intelligence",CI:"Creative Intelligence",EX:"Execution",TF:"Technical Fluency",CO:"Communication",CM:"Commercial Intelligence",LC:"Leadership & Collaboration",AL:"Adaptability & Learning"};

export default function EtsaResultsPage(){
  const router=useRouter();
  const [status,setStatus]=useState("LOADING");
  const [report,setReport]=useState<CandidateReport|null>(null);
  const [error,setError]=useState("");
  const [locked,setLocked]=useState(false);
  const [attemptNumber,setAttemptNumber]=useState(1);

  useEffect(()=>{(async()=>{
    const response=await fetch("/api/etsa/results");
    if(response.status===401){router.replace("/etsa/login");return;}
    const body=await response.json().catch(()=>({}));
    if(!response.ok){setError(body.error||"Unable to load assessment result.");return;}
    if(!body.session){router.replace("/etsa");return;}
    setStatus(body.session.status);
    setReport(body.report||null);
    setLocked(Boolean(body.locked));
    setAttemptNumber(Number(body.attemptNumber||1));
  })();},[router]);

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Candidate Talent Profile</div>
    <h1 className={styles.title}>{locked?"Your reassessment is complete.":report?"Your ETSA profile.":"Assessment complete."}</h1>
    <div className={styles.card}>
      {error?<p className={styles.error}>{error}</p>:locked?<>
        <div className={styles.resultHero}>
          <span className={styles.sectionLabel}>ETSA Reassessment #{attemptNumber}</span>
          <strong>Your updated profile is ready.</strong>
          <p className={styles.notice}>You have completed your included ETSA reassessment. The updated talent profile, department alignment, competency scores, readiness classification, development priorities, and corresponding paperwork are retained securely but are not included with the reassessment.</p>
          <p className={styles.muted}>Unlock the full reassessment package to view and retain the updated ETSA paperwork.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={()=>router.push("/etsa/unlock")}>UNLOCK REASSESSMENT RESULTS</button>
        </div>
      </>:report?<>
        <div className={styles.resultHero}><span className={styles.sectionLabel}>Talent Archetype</span><strong>{report.talentArchetype}</strong>{report.yourThing&&<p className={styles.notice}><b>Your Thing™:</b> {report.yourThing}</p>}</div>
        <div className={styles.divider}/>
        <div className={styles.grid}>{report.departmentAlignments.map((item,i)=><div className={styles.metric} key={item.department}><span>{i===0?"Primary":i===1?"Secondary":"Tertiary"} Alignment</span><strong>{item.department}</strong><span>{item.score}%</span></div>)}</div>
        <div className={styles.divider}/>
        <h2>Core Competencies</h2><div className={styles.grid}>{Object.entries(report.dimensionScores).map(([code,score])=><div className={styles.metric} key={code}><span>{dimensionNames[code]||code}</span><strong>{score}</strong><span>{report.evidenceConfidence[code]||""}</span></div>)}</div>
        <div className={styles.divider}/>
        <div className={styles.grid}><div className={styles.metric}><span>Current Readiness</span><strong>{report.readinessLevel}</strong><span>Current demonstrated responsibility</span></div><div className={styles.metric}><span>Development Priority</span><strong>{dimensionNames[report.developmentPriority]||report.developmentPriority}</strong><span>Highest-leverage next capability</span></div><div className={styles.metric}><span>Assessment Version</span><strong>{report.assessmentVersion}</strong><span>Versioned result</span></div></div>
      </>:<div className={styles.resultHero}><strong>{status==="REVIEW_REQUIRED"?"Your responses are in review.":status.replaceAll("_"," ")}</strong><p className={styles.notice}>ETSA v1.0 includes applied challenges that require human calibration during the internal pilot. Your original responses are retained as a versioned assessment record. Your candidate-facing profile will appear here after review is finalized.</p><p className={styles.muted}>Assessment version: ETSA-1.0</p></div>}
      <div className={styles.actions}><button className={styles.secondary} onClick={()=>router.push("/")}>RETURN TO BPEI</button></div>
    </div>
  </div></main>;
}
