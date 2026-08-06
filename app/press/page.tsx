import { PageShell } from "../components/SiteChrome";
import styles from "./press.module.css";

const articleOne = {
  title: 'The Company That Turns “Impossible to Explain” Into a Functioning Enterprise',
  status: 'Approved website excerpts',
  quotes: [
    'A business infrastructure firm out of Ogden, Utah is building a system for the founders traditional consultants tend to turn away.',
    'That gap is exactly where BI POLARIZE ENTERPRISES, INC. is planting its flag.',
    'The company positions itself not as a consulting agency or a marketing shop, but as what it calls an innovation infrastructure firm.',
    'It is built specifically for unconventional founders who need systems, not slogans.',
  ],
};

export default function PressPage() {
  return (
    <PageShell>
      <section className={styles.hero}>
        <p className="eyebrow">PRESS // EDITORIAL RECOGNITION</p>
        <h1>WHAT OTHERS SEE<br /><em>WHEN THEY LOOK CLOSER.</em></h1>
        <p>
          Selected excerpts are presented as attributed editorial observations,
          not rewritten as self-praise. The full articles remain separate press assets.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.article}>
          <div className={styles.meta}>ARTICLE 01 // {articleOne.status}</div>
          <h2>{articleOne.title}</h2>
          <div className={styles.quotes}>
            {articleOne.quotes.map((quote) => (
              <blockquote key={quote}>“{quote}”</blockquote>
            ))}
          </div>
        </article>

        <article className={styles.article}>
          <div className={styles.meta}>ARTICLE 02 // SOURCE COPY REQUIRED</div>
          <h2>Second approved article</h2>
          <p>
            This article slot is intentionally withheld until the exact approved
            title, publication attribution, and copy are available. No substitute
            language will be published in its place.
          </p>
        </article>
      </section>
    </PageShell>
  );
}
