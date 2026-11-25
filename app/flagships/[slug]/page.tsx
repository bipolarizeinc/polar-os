import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { flagships, getFlagship } from "../../brand-data";
import { IntakeLink } from "../../components/IntakeLink";
import { MarketingShell } from "../../components/MarketingShell";
import { flagshipLanding } from "../landing-copy";
import styles from "../landing.module.css";

type Props = { params: Promise<{ slug: string }> };
type Slug = keyof typeof flagshipLanding;
const checkout = "/checkout/bipolarized-blueprint";

export function generateStaticParams() {
  return flagships.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getFlagship((await params).slug);
  if (!item) notFound();
  const { intro: description } = flagshipLanding[item.slug];
  const url = `/flagships/${item.slug}`;
  return {
    title: item.name,
    description,
    alternates: { canonical: url },
    openGraph: { title: item.name, description, url, images: [{ url: item.image, alt: item.name }] },
  };
}

function NextAction({ slug }: { slug: Slug }) {
  const { action } = flagshipLanding[slug];
  const className = "parity-button parity-primary";
  const label = <>{action} <span aria-hidden="true">↗</span></>;
  return slug === "blueprint"
    ? <Link className={className} href={checkout}>{label}</Link>
    : <IntakeLink className={className} service={getFlagship(slug)?.name} source={`flagship-${slug}`} ariaLabel={action}>{label}</IntakeLink>;
}

export default async function FlagshipDetail({ params }: Props) {
  const item = getFlagship((await params).slug);
  if (!item) notFound();
  const data = flagshipLanding[item.slug];
  const next = flagships[flagships.findIndex(({ slug }) => slug === item.slug) + 1];
  const startingStages = item.slug === "extraction" || item.slug === "blueprint";

  return <MarketingShell>
    <article className={styles.landing} style={{ "--stage-accent": data.accent } as CSSProperties}>
      <section className={styles.hero} aria-labelledby="flagship-title">
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/flagships">All flagships</Link><span aria-hidden="true"> / </span><span>{item.shortName}</span></nav>
          <p className={styles.kicker}>Flagship {item.step} / 05 · {item.eyebrow}</p>
          <h1 id="flagship-title">{item.name}</h1>
          <p className={styles.promise}>{data.promise}</p>
          <p className={styles.intro}>{data.intro}</p>
          <div className={styles.actions}>
            <NextAction slug={item.slug} />
            {item.slug === "extraction" && <Link className="text-action" href={checkout}>Review the $499 Blueprint →</Link>}
            {startingStages && <Link className="text-action" href="/sample-blueprint">See a sample Blueprint →</Link>}
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <Image src={item.image} alt="" fill preload sizes="(max-width: 800px) 92vw, 43vw" className={item.slug === "extraction" ? styles.contain : undefined} />
          <span>{item.step}</span>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="deliverables">
        <p className={styles.kicker}>What you walk away with</p>
        <h2 id="deliverables">The deliverables</h2>
        <ol className={styles.cards}>
          {data.deliverables.map(([title, details], i) => <li key={title}><span aria-hidden="true">0{i + 1}</span><h3>{title}</h3><p>{details}</p></li>)}
        </ol>
      </section>
      <section className={styles.details} aria-label="Fit and scope">
        <div><h2>Who it’s for</h2><p>{data.fit}</p></div>
        <div><h2>What to bring</h2><p>{data.bring}</p></div>
        <div><h2>What’s included</h2><p>{data.scope}</p></div>
      </section>
      <section className={styles.section} aria-labelledby="common-questions">
        <p className={styles.kicker}>Before you start</p>
        <h2 id="common-questions">Common questions</h2>
        <div className={styles.faq}>
          {data.questions.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </div>
      </section>
      <section className={styles.bottom} aria-label="Next steps">
        <div><p className={styles.kicker}>Your next move</p><h2>{data.promise}</h2></div>
        <div className={styles.actions}><NextAction slug={item.slug} /><Link className="text-action" href="/shop#individual">Shop individual services →</Link></div>
      </section>
      <nav className={styles.stageNav} aria-label="Flagship stages">
        <Link href="/flagships">← All five flagships</Link>
        {next && <Link href={`/flagships/${next.slug}`}>Next: {next.shortName} →</Link>}
      </nav>
    </article>
  </MarketingShell>;
}
