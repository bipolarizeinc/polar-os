import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-black text-cyan-400">
            BI POLARIZE
          </Link>

          <Link href="/" className="text-sm text-gray-300 hover:text-cyan-400">
            Back Home
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">
            About BI POLARIZE
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight sm:text-7xl">
            Infrastructure for ideas that do not fit the usual mold.
          </h1>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            BI POLARIZE ENTERPRISES, INC. helps founders transform unconventional
            concepts into structured, operational businesses.
          </p>

          <p className="mt-5 text-lg leading-8 text-gray-400">
            We combine strategic research, business architecture, artificial
            intelligence, automation, and disciplined execution to move ideas
            from imagination into reality.
          </p>
        </div>

        <div className="relative min-h-[560px] overflow-hidden rounded-3xl border border-white/10">
          <Image
            src="/founder.jpg"
            alt="Douglas Arnold Long Jr."
            fill
            className="object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-8 pt-32">
            <h2 className="text-3xl font-black">Douglas Arnold Long Jr.</h2>
            <p className="mt-2 text-gray-300">
              Founder &amp; Director of Operations
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}