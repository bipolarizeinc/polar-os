import Link from "next/link";

export function LegalFooter() {
  return (
    <footer className="legal-footer" aria-label="Legal and corporate information">
      <span>© {new Date().getFullYear()} BI POLARIZE ENTERPRISES, INC.</span>
      <nav aria-label="Legal">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Use</Link>
        <a href="mailto:YourThing@PolarPaw.Online">YourThing@PolarPaw.Online</a>
      </nav>
      <span>Ogden, Utah · PolarPaw.Online</span>
    </footer>
  );
}
