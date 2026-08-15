"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../etsa.module.css";

export default function EtsaLoginPage(){
  const router = useRouter();
  const [mode,setMode]=useState<"login"|"register">("register");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setLoading(true); setError("");
    const data=new FormData(event.currentTarget);
    const payload=mode==="register"
      ? {fullName:String(data.get("fullName")||""),email:String(data.get("email")||""),password:String(data.get("password")||"")}
      : {email:String(data.get("email")||""),password:String(data.get("password")||"")};
    const response=await fetch(`/api/etsa/auth/${mode}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    const body=await response.json().catch(()=>({}));
    setLoading(false);
    if(!response.ok){setError(body.error||"Unable to continue.");return;}
    router.push("/etsa/notice");
  }

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Secure Participant Access</div>
    <h1 className={styles.title}>{mode==="login"?"Welcome back.":"Create your ETSA account to begin."}</h1>
    <div className={styles.card}>
      {mode==="register"&&<p className={styles.notice}>Your account saves your assessment progress and keeps your ETSA results connected to you. Registration takes less than a minute.</p>}
      <form className={styles.form} onSubmit={submit}>
        {mode==="register"&&<div className={styles.field}><label>Full name</label><input name="fullName" autoComplete="name" required /></div>}
        <div className={styles.field}><label>Email</label><input name="email" type="email" autoComplete="email" required /></div>
        <div className={styles.field}><label>Password</label><input name="password" type="password" minLength={8} autoComplete={mode==="login"?"current-password":"new-password"} required /></div>
        {error&&<div className={styles.error}>{error}</div>}
        <button className={styles.button} disabled={loading}>{loading?"CONTINUING…":mode==="login"?"LOGIN & CONTINUE":"CREATE ACCOUNT & START ETSA"}</button>
      </form>
      <div className={styles.divider}/>
      <button className={styles.secondary} onClick={()=>{setMode(mode==="login"?"register":"login");setError("")}}>{mode==="login"?"CREATE A NEW ACCOUNT":"I ALREADY HAVE AN ETSA ACCOUNT"}</button>
    </div>
  </div></main>;
}
