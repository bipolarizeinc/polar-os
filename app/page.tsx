import Image from "next/image";

const services = [
  {
    title: "Business Architecture",
    description:
      "We turn raw ideas into structured businesses with clear positioning, systems, workflows, and practical execution plans.",
  },
  {
    title: "AI & Automation",
    description:
      "We design intelligent tools that reduce repetitive work, improve decision-making, and help teams move faster.",
  },
  {
    title: "Innovation Consulting",
    description:
      "We help unconventional ideas survive contact with reality through research, strategy, testing, and disciplined development.",
  },
];

const advantages = [
  "Built for unconventional founders and ambitious ideas",
  "Strategy connected directly to execution",
  "AI-powered systems designed around real business needs",
  "Practical infrastructure instead of empty presentations",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="#home"
            className="text-lg font-black tracking-wide text-cyan-400"
          >
            BI POLARIZE
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a
              href="#home"
              className="text-gray-300 transition hover:text-cyan-400"
            >
              Home
            </a>

            <a
              href="#services"
              className="text-gray-300 transition hover:text-cyan-400"
            >
              Services
            </a>

            <a
              href="#about"
              className="text-gray-300 transition hover:text-cyan-400"
            >
              About
            </a>

            <a
              href="#contact"
              className="rounded-full bg-cyan-400 px-5 py-2.5 text-black transition hover:bg-cyan-300"
            >
              Start a Project
            </a>
          </nav>

          <a
            href="#contact"
            className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-black md:hidden"
          >
            Contact
          </a>
        </div>
      </header>

      <section
        id="home"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-700/10 blur-3xl" />

        <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-cyan-400">
              BI POLARIZE ENTERPRISES, INC.
            </p>

            <p className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Powered by P.O.L.A.R. OS
            </p>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
              Ideas Don&apos;t Need Permission.
              <span className="mt-3 block text-cyan-400">
                They Need Infrastructure.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
              We transform unconventional ideas into functional businesses
              through research, strategic architecture, artificial intelligence,
              and disciplined execution.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:YourThing@PolarPaw.Online"
                className="rounded-xl bg-cyan-400 px-7 py-4 text-center font-black text-black transition hover:bg-cyan-300"
              >
                Tell Us About Your Thing
              </a>

              <a
                href="#services"
                className="rounded-xl border border-white/20 px-7 py-4 text-center font-black text-white transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Explore Services
              </a>
            </div>

            <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-black text-white">Strategy</p>
                <p className="mt-1 text-sm text-gray-500">
                  Clear direction
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-white">Systems</p>
                <p className="mt-1 text-sm text-gray-500">
                  Real infrastructure
                </p>
              </div>

              <div>
                <p className="text-2xl font-black text-white">Execution</p>
                <p className="mt-1 text-sm text-gray-500">
                  Measurable progress
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-cyan-400/10 blur-2xl" />

            <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-2xl">
              <Image
                src="/founder.jpg"
                alt="Douglas Arnold Long Jr., founder of BI POLARIZE ENTERPRISES"
                fill
                priority
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
                  Founder
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  Douglas Arnold Long Jr.
                </h2>

                <p className="mt-2 text-gray-300">
                  Founder &amp; Director of Operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="border-b border-white/10 bg-zinc-950 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">
              What We Build
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              From bold concept to working operation.
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              BI POLARIZE ENTERPRISES transforms vision into operational
              structure. We connect strategy, technology, and execution so ideas
              can become durable businesses instead of abandoned notes in a
              folder somewhere.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group rounded-3xl border border-white/10 bg-black p-8 transition hover:-translate-y-1 hover:border-cyan-400/60"
              >
                <p className="text-sm font-black text-cyan-400">
                  0{index + 1}
                </p>

                <h3 className="mt-8 text-2xl font-black">{service.title}</h3>

                <p className="mt-5 leading-7 text-gray-400">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-white/10 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">
              Why BI POLARIZE
            </p>

            <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              Built for ideas that refuse to fit neatly inside a box.
            </h2>

            <p className="mt-7 text-lg leading-8 text-gray-400">
              Most organizations are built to improve familiar ideas. BI
              POLARIZE exists for concepts that need deeper research, stronger
              architecture, and a more flexible path from imagination to
              execution.
            </p>

            <p className="mt-5 text-lg leading-8 text-gray-400">
              Our work combines human judgment with intelligent systems to help
              founders clarify their direction, design their operation, and
              build the infrastructure required to move forward.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 sm:p-10">
            <p className="text-xl font-black">The BI POLARIZE advantage</p>

            <div className="mt-8 space-y-5">
              {advantages.map((advantage) => (
                <div
                  key={advantage}
                  className="flex gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                >
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-black">
                    ✓
                  </span>

                  <p className="leading-7 text-gray-300">{advantage}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-cyan-400 px-6 py-24 text-black"
      >
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em]">
            Start Building
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Your idea deserves more than another unfinished plan.
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-black/70">
            Tell us what you are trying to create, what is blocking progress,
            and where you want the idea to go. We will help determine the
            structure required to move it forward.
          </p>

          <a
            href="mailto:YourThing@PolarPaw.Online"
            className="mt-10 inline-block rounded-xl bg-black px-8 py-4 font-black text-white transition hover:bg-zinc-900"
          >
            YourThing@PolarPaw.Online
          </a>
        </div>
      </section>

      <footer className="bg-black px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">
              BI POLARIZE ENTERPRISES, INC.
            </p>

            <p className="mt-2">Powered by P.O.L.A.R. OS</p>
          </div>

          <p>
            © {new Date().getFullYear()} BI POLARIZE ENTERPRISES, INC. All
            rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}