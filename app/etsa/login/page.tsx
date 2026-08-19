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
    event.preventDefault();
    setLoading(true);
    setError("");

    const data=new FormData(event.currentTarget);
    const payload=mode==="register"
      ? {fullName:String(data.get("fullName")||""),email:String(data.get("email")||""),password:String(data.get("password")||"")}
      : {email:String(data.get("email")||""),password:String(data.get("password")||"")};

    const response=await fetch(`/api/etsa/auth/${mode}`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    const body=await response.json().catch(()=>({}));
    setLoading(false);

    if(!response.ok){
      const message=String(body.error||"Unable to continue.");
      if(mode==="login"){
        setError("We couldn't sign you in with that email and password. If this is your first ETSA visit, choose CREATE NEW ACCOUNT below.");
      }else if(/already registered|already exists|user exists/i.test(message)){
        setMode("login");
        setError("An ETSA account already exists for that email. Sign in with the password you created.");
      }else{
        setError(message);
      }
      return;
    }

    router.push("/etsa/notice");
  }

  function switchMode(next:"login"|"register"){
    setMode(next);
    setError("");
  }

  return <main className={styles.shell}><div className={styles.wrap}>
    <div className={styles.eyebrow}>ETSA™ • Secure Participant Access</div>
    <h1 className={styles.title}>{mode==="login"?"Sign in to continue your ETSA.":"Create your ETSA account to begin."}</h1>
    <div className={styles.card}>
      <div className={styles.actions}>
        <button className={mode==="register"?styles.button:styles.secondary} type="button" onClick={()=>switchMode("register")}>CREATE NEW ACCOUNT</button>
        <button className={mode==="login"?styles.button:styles.secondary} type="button" onClick={()=>switchMode("login")}>SIGN IN</button>
      </div>

      {mode==="register"&&<p className={styles.notice}>First time here? Use this form. Your account is created immediately so you can continue directly into ETSA.</p>}
      {mode==="login"&&<p className={styles.notice}>Already created an ETSA account? Enter the same email and password you used when registering.</p>}

      <form className={styles.form} onSubmit={submit}>
        {mode==="register"&&<div className={styles.field}><label>Full name</label><input name="fullName" autoComplete="name" required /></div>}
        <div className={styles.field}><label>Email</label><input name="email" type="email" autoComplete="email" required /></div>
        <div className={styles.field}><label>Password</label><input name="password" type="password" minLength={8} autoComplete={mode==="login"?"current-password":"new-password"} required /></div>
        {error&&<div className={styles.error}>{error}</div>}
        <button className={styles.button} disabled={loading}>{loading?"CONTINUING…":mode==="login"?"SIGN IN & CONTINUE":"CREATE ACCOUNT & START ETSA"}</button>
      </form>

      {mode==="login"&&<button className={styles.secondary} type="button" onClick={()=>switchMode("register")}>FIRST TIME HERE? CREATE NEW ACCOUNT</button>}
    </div>
  </div></main>;
}
