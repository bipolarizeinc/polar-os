import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IntakeLink } from "../../components/IntakeLink";
import { PageShell } from "../../components/SiteChrome";
import { flagships, getFlagship } from "../../brand-data";
import styles from "../../marketing-pages.module.css";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return flagships.map(({slug})=>({slug}))}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const item=getFlagship(slug);if(!item)notFound();return{title:item.name,description:item.description,alternates:{canonical:`/flagships/${item.slug}`}}}
export default async function FlagshipDetail({params}:Props){const {slug}=await params;const item=getFlagship(slug);if(!item)notFound();return <PageShell><section className={styles.detail}><div className={styles.detailMedia}><Image src={item.image} alt={`${item.name} approved visual`} fill priority sizes="(max-width: 860px) 100vw, 50vw"/></div><div className={styles.detailCopy}><p className="eyebrow">{item.step} // {item.eyebrow}</p><h1>{item.name}</h1><p>{item.headline}</p><p>{item.description}</p><IntakeLink division={item.slug==="blueprint"?"blueprint":undefined} service={item.name} source="flagship-page"/></div></section><section className={styles.outcomes}><div><p className="eyebrow">WHAT THIS STAGE BUILDS</p><h2>THE RESULT<br/><em>HAS TO WORK.</em></h2></div><ol>{item.outcomes.map((outcome,index)=><li key={outcome}><span>0{index+1}</span><b>{outcome}</b></li>)}</ol></section><div className={styles.back}><Link href="/flagships">← ALL FLAGSHIPS</Link><Link href="/contact">ASK A QUESTION →</Link></div></PageShell>}
