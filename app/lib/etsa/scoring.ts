export type Dimension = "SI" | "CI" | "EX" | "TF" | "CO" | "CM" | "LC" | "AL";
export type DimensionScores = Record<Dimension, number>;

export const BEHAVIORAL_KEY: Record<number, number[]> = {
  16:[2,1,4,0,2],17:[1,4,3,0,0],18:[2,1,4,0,1],19:[1,2,4,0,1],20:[2,1,4,0,2],
  21:[2,0,4,1,1],22:[1,2,4,1,0],23:[0,1,4,2,0],24:[2,1,4,2,1],25:[2,1,4,1,2],
  26:[1,0,4,0,1],27:[1,0,4,1,0],28:[1,1,4,0,1],29:[1,2,4,1,0],30:[1,2,4,0,0],
  31:[1,1,4,0,2],32:[1,0,4,2,0],33:[0,1,4,0,2],34:[1,2,4,0,2],35:[1,1,4,0,1]
};

export const COGNITIVE_KEY: Record<number, number> = {
  36:2,37:1,38:0,39:1,40:3,41:1,42:1,43:2,44:2,45:1,46:1,47:2,48:2,49:2,50:1
};

const DEPARTMENT_WEIGHTS: Record<string, Partial<Record<Dimension, number>>> = {
  "Blueprint™": { SI:.25, EX:.20, CO:.15, CI:.15, AL:.10, TF:.10, CM:.05 },
  "BrandForge™": { CI:.30, CO:.20, CM:.15, SI:.10, EX:.10, AL:.10, TF:.05 },
  "Sav.VidzGen™": { CI:.25, TF:.20, CO:.20, EX:.15, CM:.10, AL:.10 },
  "Dr.Docx™": { EX:.25, CO:.25, SI:.15, TF:.10, AL:.10, CI:.10, CM:.05 },
  "LaunchPad™": { CM:.25, EX:.20, SI:.20, CO:.15, LC:.10, AL:.10 },
  "Nexus™": { LC:.25, CO:.25, SI:.15, CM:.15, EX:.10, AL:.10 },
  "Pulse™": { SI:.25, CM:.20, TF:.15, EX:.15, CO:.10, AL:.10, CI:.05 },
  "Vault™": { EX:.30, SI:.20, TF:.15, CO:.10, LC:.10, AL:.10, CM:.05 },
  "Cipher™": { TF:.30, SI:.25, EX:.15, AL:.15, CO:.05, LC:.05, CM:.05 }
};

const ARCHETYPES = [
  {name:"Strategic Systems Builder", test:(s:DimensionScores)=>s.SI>=80&&s.EX>=75},
  {name:"Creative Architect", test:(s:DimensionScores)=>s.CI>=80&&s.SI>=70},
  {name:"Technical Problem Solver", test:(s:DimensionScores)=>s.TF>=80&&s.SI>=70},
  {name:"Operational Executor", test:(s:DimensionScores)=>s.EX>=80&&s.AL>=70},
  {name:"Intelligence Analyst", test:(s:DimensionScores)=>s.SI>=80&&s.CM>=70&&s.TF>=65},
  {name:"Communication Strategist", test:(s:DimensionScores)=>s.CO>=80&&s.CI>=70&&s.CM>=65},
  {name:"Relationship Catalyst", test:(s:DimensionScores)=>s.LC>=80&&s.CO>=75},
  {name:"Commercial Builder", test:(s:DimensionScores)=>s.CM>=80&&s.EX>=70&&s.CO>=70},
  {name:"Systems Leader", test:(s:DimensionScores)=>s.SI>=80&&s.LC>=80&&s.EX>=75},
  {name:"Creative Technologist", test:(s:DimensionScores)=>s.CI>=80&&s.TF>=75},
  {name:"Precision Operator", test:(s:DimensionScores)=>s.EX>=85&&s.SI>=75}
];

export function normalizeRating1to5(value:number){ return Math.max(0,Math.min(100,(value-1)*25)); }
export function normalizeBehavior(value:number){ return Math.max(0,Math.min(100,(value/4)*100)); }
export function normalizeChallenge(value:number){ return Math.max(0,Math.min(100,(value/5)*100)); }
export function clampScore(value:number){ return Math.round(Math.max(0,Math.min(100,value))); }

export function weightedCoreScore(layers:{l1?:number;l2?:number;l3?:number;l4?:number}, workstyleModifier=0){
  const definitions:[keyof typeof layers,number][] = [["l1",.15],["l2",.30],["l3",.25],["l4",.30]];
  const present = definitions.filter(([key])=>typeof layers[key] === "number");
  const totalWeight = present.reduce((sum,[,weight])=>sum+weight,0);
  if(!totalWeight) return 0;
  const base = present.reduce((sum,[key,weight])=>sum+((layers[key] as number)*weight),0)/totalWeight;
  return clampScore(base + Math.max(-5,Math.min(5,workstyleModifier)));
}

export function calculateDepartmentScores(scores:DimensionScores){
  return Object.fromEntries(Object.entries(DEPARTMENT_WEIGHTS).map(([department,weights])=>{
    const score = Object.entries(weights).reduce((sum,[dimension,weight])=>sum + scores[dimension as Dimension]*(weight ?? 0),0);
    return [department,clampScore(score)];
  }));
}

export function rankDepartments(scores:DimensionScores){
  return Object.entries(calculateDepartmentScores(scores)).sort((a,b)=>b[1]-a[1]);
}

export function chooseArchetype(scores:DimensionScores){
  const matched = ARCHETYPES.filter(a=>a.test(scores));
  if(matched.length) return matched[0].name;
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const spread = sorted[0][1]-sorted[sorted.length-1][1];
  return spread <= 15 && scores.AL >= 70 ? "Adaptive Generalist" : "Developing Talent Profile";
}

export function readinessLevel(scores:DimensionScores, primaryAlignment:number, demonstratedCritical:number, verifiedLeadership=false){
  if (verifiedLeadership && scores.SI>=85 && scores.LC>=85 && scores.CM>=75 && scores.EX>=80) return "R6";
  if (primaryAlignment>=85 && scores.SI>=80 && scores.EX>=75 && demonstratedCritical>=3) return "R5";
  if (primaryAlignment>=80 && scores.LC>=75 && scores.EX>=75 && demonstratedCritical>=2) return "R4";
  if (primaryAlignment>=75 && demonstratedCritical>=2) return "R3";
  if (primaryAlignment>=65 && scores.EX>=60) return "R2";
  if (primaryAlignment>=50) return "R1";
  return "R0";
}

export function consistencyFlag(selfReported:number, demonstrated:number){
  const difference = Math.abs(selfReported-demonstrated);
  if(difference>=31) return "SIGNIFICANT_DISCREPANCY";
  if(difference>=21) return "VERIFY";
  if(difference>=11) return "NORMAL_VARIANCE";
  return "STRONG_CONSISTENCY";
}
