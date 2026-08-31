import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeferredVideo } from "../../components/DeferredVideo";
import { IntakeLink } from "../../components/IntakeLink";
import { PageShell } from "../../components/SiteChrome";
import { divisions, getDivision } from "../../brand-data";
import styles from "../../marketing-pages.module.css";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return divisions.map(({slug})=>({slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=getDivision(slug);if(!item)notFound();return{title:`${item.name} Division`,description:item.description,alternates:{canonical:`/divisions/${item.slug}`}}}
export default async function DivisionDetail({params}:Props){const {slug}=await params;const division=getDivision(slug);if(!division)notFound();return <PageShell><section className={styles.detail}><div className={`${styles.detailMedia} ${styles.divisionDetailMedia}`}><div><Image src={division.image} alt={`${division.name} approved divisional P.O.L.A.R.`} fill priority sizes="(max-width: 860px) 100vw, 50vw"/></div><DeferredVideo src={division.video} poster={division.image} label={`${division.name} division introduction`}/></div><div className={styles.detailCopy}><p className="eyebrow">{division.code} // {division.polar}</p><h1>{division.name}</h1><p>{division.description}</p><div className={styles.capabilities}>{division.capabilities.map((capability,index)=><span key={capability}><small>0{index+1}</small>{capability}</span>)}</div><IntakeLink division={division.slug} service={division.name} source="division-page"/></div></section><div className={styles.back}><Link href="/divisions">← ALL DIVISIONS</Link><Link href="/flagships/blueprint">NOT SURE WHERE TO START? BEGIN WITH BLUEPRINT →</Link></div></PageShell>}
