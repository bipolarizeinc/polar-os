import Link from "next/link";

const services = [
  {
    title: "Business Architecture",
    description:
      "Business models, positioning, workflows, operating systems, and execution plans.",
  },
  {
    title: "AI & Automation",
    description:
      "Custom AI workflows and automation systems designed around real operational needs.",
  },
  {
    title: "Research & Strategy",
    description:
      "Market research, concept validation, opportunity analysis, and strategic planning.",
  },
  {
    title: "Digital Infrastructure",
    description:
      "Web platforms, internal tools, dashboards, and connected business systems.",
  },
  {
    title: "Innovation Consulting",
    description:
      "Practical guidance for developing ideas that fall outside conventional categories.",
  },
  {
    title: "Operational Development",
    description:
      "Processes, documentation, systems, and structure required to run and scale.",
  },
];

export default function ServicesPage() {
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

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">
          Services
        </p>

        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight sm:text-7xl">
          Strategy, systems, and execution under one roof.
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-400">
          We build the structure required to move ideas forward, because
          motivational speeches remain stubbornly incompatible with actual
          operations.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-8"
            >
              <p className="text-sm font-black text-cyan-400">
                0{index + 1}
              </p>

              <h2 className="mt-7 text-2xl font-black">{service.title}</h2>

              <p className="mt-4 leading-7 text-gray-400">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}