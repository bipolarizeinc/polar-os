import "server-only";

import {
  BEHAVIORAL_KEY,
  COGNITIVE_KEY,
  calculateDepartmentScores,
  chooseArchetype,
  consistencyFlag,
  normalizeBehavior,
  normalizeChallenge,
  normalizeRating1to5,
  readinessLevel,
  weightedCoreScore,
  type Dimension,
  type DimensionScores,
} from "./scoring";

export type StoredEtsaResponse = {
  question_id: number;
  answer_value: unknown;
  answer_text: string | null;
};

export type EtsaReviewScore = {
  question_id: number;
  score: number;
  notes?: string | null;
};

type Weighted = { total: number; weight: number };
type Buckets = Record<Dimension, Weighted>;

const DIMENSIONS: Dimension[] = ["SI","CI","EX","TF","CO","CM","LC","AL"];

function emptyBuckets(): Buckets {
  return Object.fromEntries(DIMENSIONS.map(d => [d,{total:0,weight:0}])) as Buckets;
}

function add(bucket: Buckets, dimension: Dimension, value: number, weight=1) {
  bucket[dimension].total += value * weight;
  bucket[dimension].weight += weight;
}

function average(bucket: Buckets, dimension: Dimension) {
  const item = bucket[dimension];
  return item.weight ? item.total / item.weight : undefined;
}

const L1_MAP: Record<number, Dimension[]> = {
  1:["SI"],2:["CI"],3:["EX"],4:["TF"],5:["CO"],6:["CO"],7:["CM"],8:["LC"],9:["SI"],10:["EX"]
};

const L2_MAP: Record<number,{primary:Dimension[];secondary?:Dimension[]}> = {
  16:{primary:["LC"],secondary:["EX"]},17:{primary:["AL"],secondary:["SI"]},18:{primary:["CO"],secondary:["CM"]},
  19:{primary:["SI"],secondary:["EX"]},20:{primary:["CO"],secondary:["LC","SI"]},21:{primary:["EX"],secondary:["CO"]},
  22:{primary:["AL"],secondary:["CO"]},23:{primary:["LC"],secondary:["CO"]},24:{primary:["SI"],secondary:["EX"]},
  25:{primary:["LC"],secondary:["CO"]},26:{primary:["CM"],secondary:["CO"]},27:{primary:["SI"],secondary:["AL"]},
  28:{primary:["AL"],secondary:["LC"]},29:{primary:["SI"],secondary:["EX"]},30:{primary:["LC"],secondary:["CO"]},
  31:{primary:["LC"],secondary:["CO"]},32:{primary:["AL"],secondary:["EX"]},33:{primary:["TF"],secondary:["SI"]},
  34:{primary:["TF"],secondary:["EX"]},35:{primary:["SI"],secondary:["EX","AL"]}
};

const L3_MAP: Record<number,{primary:Dimension[];secondary?:Dimension[]}> = {
  36:{primary:["SI"],secondary:["EX"]},37:{primary:["SI"],secondary:["CM"]},38:{primary:["SI"],secondary:["EX"]},
  39:{primary:["SI"],secondary:["EX"]},40:{primary:["CM"],secondary:["SI"]},41:{primary:["CM"],secondary:["SI"]},
  42:{primary:["CM"],secondary:["SI"]},43:{primary:["EX"],secondary:["CO"]},44:{primary:["SI"],secondary:["AL"]},
  45:{primary:["SI"],secondary:["TF"]},46:{primary:["SI"],secondary:["CM"]},47:{primary:["SI"],secondary:["AL"]},
  48:{primary:["EX"],secondary:["SI"]},49:{primary:["SI"],secondary:["CM"]},50:{primary:["SI"],secondary:["EX"]}
};

const WORKSTYLE_MAP: Record<number,{primary:Dimension[];secondary?:Dimension[]}> = {
  51:{primary:["AL"]},52:{primary:["EX"]},53:{primary:["SI"]},54:{primary:["AL"]},55:{primary:["EX"]},
  56:{primary:["EX"],secondary:["SI"]},57:{primary:["CO"]},58:{primary:["LC"]},59:{primary:["SI"]},
  60:{primary:["SI"],secondary:["EX"]},61:{primary:["LC"]},62:{primary:["SI"]},63:{primary:["LC"]},
  64:{primary:["CM"]},65:{primary:["TF"],secondary:["AL"]}
};

const L4_MAP: Record<number,{primary:Dimension[];secondary?:Dimension[]}> = {
  66:{primary:["SI"],secondary:["EX","CM"]},67:{primary:["CO"],secondary:["TF"]},68:{primary:["CI"],secondary:["CM"]},
  69:{primary:["TF","SI"],secondary:["EX"]},70:{primary:["AL"],secondary:["LC","EX"]}
};

function optionIndex(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function distribute(bucket:Buckets,mapping:{primary:Dimension[];secondary?:Dimension[]},score:number){
  mapping.primary.forEach(d=>add(bucket,d,score,1));
  mapping.secondary?.forEach(d=>add(bucket,d,score,.5));
}

function layerRecord(bucket:Buckets): Partial<Record<Dimension,number>> {
  return Object.fromEntries(DIMENSIONS.flatMap(d=>{const value=average(bucket,d);return value===undefined?[]:[[d,Math.round(value)]];}));
}

function workstyleModifier(score:number|undefined){
  if(score===undefined)return 0;
  return Math.max(-5,Math.min(5,(score-50)/10));
}

function evidenceFor(l1:number|undefined,l2:number|undefined,l3:number|undefined,l4:number|undefined){
  const demonstrated=[l3,l4].filter((v):v is number=>typeof v==="number");
  if(demonstrated.length && demonstrated.reduce((a,b)=>a+b,0)/demonstrated.length>=70)return "Demonstrated";
  if(typeof l2==="number" || demonstrated.length)return "Supported";
  if(typeof l1==="number")return "Claimed";
  return "Insufficient Evidence";
}

export function scoreEtsaAssessment(responses:StoredEtsaResponse[],reviewScores:EtsaReviewScore[]){
  const byQuestion=new Map(responses.map(r=>[r.question_id,r]));
  const reviews=new Map(reviewScores.map(r=>[r.question_id,r.score]));
  const l1=emptyBuckets(),l2=emptyBuckets(),l3=emptyBuckets(),l4=emptyBuckets(),workstyle=emptyBuckets();

  for(const [questionId,dimensions] of Object.entries(L1_MAP)){
    const index=optionIndex(byQuestion.get(Number(questionId))?.answer_value); if(index===null)continue;
    const score=normalizeRating1to5(index+1); dimensions.forEach(d=>add(l1,d,score));
  }
  for(const [questionId,mapping] of Object.entries(L2_MAP)){
    const q=Number(questionId),index=optionIndex(byQuestion.get(q)?.answer_value); if(index===null)continue;
    const raw=BEHAVIORAL_KEY[q]?.[index]; if(raw===undefined)continue; distribute(l2,mapping,normalizeBehavior(raw));
  }
  for(const [questionId,mapping] of Object.entries(L3_MAP)){
    const q=Number(questionId),index=optionIndex(byQuestion.get(q)?.answer_value); if(index===null)continue;
    distribute(l3,mapping,index===COGNITIVE_KEY[q]?100:0);
  }
  for(const [questionId,mapping] of Object.entries(WORKSTYLE_MAP)){
    const q=Number(questionId),index=optionIndex(byQuestion.get(q)?.answer_value); if(index===null)continue;
    distribute(workstyle,mapping,normalizeRating1to5(index+1));
  }
  for(const [questionId,mapping] of Object.entries(L4_MAP)){
    const q=Number(questionId),raw=reviews.get(q); if(raw===undefined)continue;
    distribute(l4,mapping,normalizeChallenge(raw));
  }

  const layerScores={l1:layerRecord(l1),l2:layerRecord(l2),l3:layerRecord(l3),l4:layerRecord(l4),workstyle:layerRecord(workstyle)};
  const dimensionScores=Object.fromEntries(DIMENSIONS.map(d=>{
    const layers={l1:average(l1,d),l2:average(l2,d),l3:average(l3,d),l4:average(l4,d)};
    return [d,weightedCoreScore(layers,workstyleModifier(average(workstyle,d)))];
  })) as DimensionScores;

  const departmentScores=calculateDepartmentScores(dimensionScores);
  const rankedDepartments=Object.entries(departmentScores).sort((a,b)=>b[1]-a[1]);
  const primaryAlignment=rankedDepartments[0]?.[1]??0;
  const demonstratedCritical=DIMENSIONS.filter(d=>{
    const values=[average(l3,d),average(l4,d)].filter((v):v is number=>typeof v==="number");
    return values.length>0 && values.reduce((a,b)=>a+b,0)/values.length>=70;
  }).length;
  const readiness=readinessLevel(dimensionScores,primaryAlignment,demonstratedCritical,false);
  const archetype=chooseArchetype(dimensionScores);
  const evidenceConfidence=Object.fromEntries(DIMENSIONS.map(d=>[d,evidenceFor(average(l1,d),average(l2,d),average(l3,d),average(l4,d))]));

  const consistency=Object.fromEntries(DIMENSIONS.map(d=>{
    const self=average(l1,d), demonstrated=[average(l3,d),average(l4,d)].filter((v):v is number=>typeof v==="number");
    if(self===undefined||!demonstrated.length)return [d,null];
    const demo=demonstrated.reduce((a,b)=>a+b,0)/demonstrated.length;
    return [d,{selfReported:Math.round(self),demonstrated:Math.round(demo),flag:consistencyFlag(self,demo)}];
  }));

  const primaryWeights:Record<string,Dimension[]>={
    "Blueprint™":["SI","EX","CO","CI"],"BrandForge™":["CI","CO","CM"],"Sav.VidzGen™":["CI","TF","CO","EX"],
    "Dr.Docx™":["EX","CO","SI"],"LaunchPad™":["CM","EX","SI","CO"],"Nexus™":["LC","CO","SI","CM"],
    "Pulse™":["SI","CM","TF","EX"],"Vault™":["EX","SI","TF"],"Cipher™":["TF","SI","EX","AL"]
  };
  const primaryDepartment=rankedDepartments[0]?.[0]??"";
  const developmentDimensions=primaryWeights[primaryDepartment]??DIMENSIONS;
  const developmentPriority=[...developmentDimensions].sort((a,b)=>dimensionScores[a]-dimensionScores[b])[0];
  const topStrengths=[...DIMENSIONS].sort((a,b)=>dimensionScores[b]-dimensionScores[a]).slice(0,5);

  const q15=byQuestion.get(15)?.answer_text?.trim()||null;
  const internalFlags=Object.entries(consistency).flatMap(([dimension,value])=>value&&value.flag==="SIGNIFICANT_DISCREPANCY"?[{type:"VERIFY",dimension,...value}]:[]);

  const candidateReport={
    assessmentVersion:"ETSA-1.0",
    talentArchetype:archetype,
    yourThing:q15,
    dimensionScores,
    topStrengths,
    departmentAlignments:rankedDepartments.slice(0,3).map(([department,score])=>({department,score})),
    readinessLevel:readiness,
    developmentPriority,
    evidenceConfidence
  };

  const internalReport={
    ...candidateReport,
    allDepartmentAlignments:rankedDepartments.map(([department,score])=>({department,score})),
    layerScores,
    consistency,
    appliedChallengeScores:Object.fromEntries([...reviews.entries()].map(([q,s])=>[q,s])),
    internalFlags,
    demonstratedCriticalDimensions:demonstratedCritical
  };

  return { dimensionScores,layerScores,departmentScores,evidenceConfidence,readiness,archetype,developmentPriority,internalFlags,candidateReport,internalReport };
}
