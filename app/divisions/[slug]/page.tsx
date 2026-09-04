import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { divisions,getDivision } from "../../brand-data";
import { IntakeLink } from "../../components/IntakeLink";
import { MarketingShell } from "../../components/MarketingShell";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return divisions.map((item)=>({slug:item.slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=getDivision(slug);if(!item)notFound();return{title:`${item.name} Division`,description:item.description,alternates:{canonical:`/divisions/${item.slug}`}}}
export default async function DivisionDetail({params}:Props){const {slug}=await params;const division=getDivision(slug);if(!division)notFound();return <MarketingShell><section className="parity-division-detail"><div className="parity-division-detail-media"><Image src={division.image} alt={`${division.name} approved divisional P.O.L.A.R.`} fill priority sizes="(max-width: 900px) 100vw, 50vw"/><div><span>{division.code}</span><b>DIVISION POLAR // ACTIVE</b></div></div><div className="parity-division-detail-copy"><div className="parity-status"><i/> P.O.L.A.R. LINK ESTABLISHED</div><p className="parity-eyebrow">{division.polar}</p><h1>{division.name}</h1><p>{division.description}</p><div className="parity-capabilities">{division.capabilities.map((capability,i)=><span key={capability}><small>0{i+1}</small>{capability}</span>)}</div><IntakeLink className="parity-button parity-primary" division={division.slug} service={division.name} source="division-page">ENGAGE {division.name.toUpperCase()} <span>↗</span></IntakeLink></div></section><section className="parity-division-back"><Link href="/divisions">← RETURN TO ALL DIVISIONS</Link><Link href="/flagships/blueprint">NOT SURE WHERE TO START? BEGIN WITH BLUEPRINT →</Link></section></MarketingShell>}
