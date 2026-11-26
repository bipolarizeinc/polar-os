"use client";

import { useEffect, useState } from "react";
import { discoveryKey } from "../../lib/etsa/discovery";
import { CareerEvidence } from "../CareerEvidence";

export function PrivateCareerEvidence(){
  const [industry,setIndustry]=useState<unknown>(null);
  useEffect(()=>{
    try{
      const raw=sessionStorage.getItem(discoveryKey);
      if(raw){
        const saved:unknown=JSON.parse(raw);
        if(typeof saved==="object"&&saved!==null&&"industry" in saved)setIndustry(saved.industry);
      }
    }catch{/* A blocked storage permission or malformed preference leaves the panel hidden. */}
  },[]);
  return <CareerEvidence industry={industry}/>;
}
