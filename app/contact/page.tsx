import Link from "next/link";

export default function ContactPage() {
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
            Contact
          </p>

          <h1 className="mt-6 text-5xl font-black leading-tight sm:text-7xl">
            Tell us what you are trying to build.
          </h1>

          <p className="mt-8 text-lg leading-8 text-gray-400">
            Describe the idea, the problem, and what is currently blocking
            progress. We will determine what structure, research, or systems may
            be required.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
            Project Inquiries
          </p>

          <h2 className="mt-5 text-3xl font-black">
            Start the conversation.
          </h2>

          <p className="mt-5 leading-7 text-gray-400">
            Email BI POLARIZE with a clear description of your project,
            intended outcome, and current challenges.
          </p>

          <a
            href="mailto:YourThing@PolarPaw.Online"
            className="mt-8 inline-block rounded-xl bg-cyan-400 px-6 py-4 font-black text-black hover:bg-cyan-300"
          >
            YourThing@PolarPaw.Online
          </a>
        </div>
      </section>
    </main>
  );
}