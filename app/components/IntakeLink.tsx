import type { ReactNode } from "react";
import Link from "next/link";

export function IntakeLink({
  className = "primary-action",
  children = <><span>TELL US ABOUT YOUR THING</span><span>↗</span></>,
  division,
  service,
  source,
}: {
  className?: string;
  children?: ReactNode;
  division?: string;
  service?: string;
  source?: string;
}) {
  const params = new URLSearchParams();
  if (division) params.set("division", division);
  if (service) params.set("service", service);
  if (source) params.set("source", source);
  const query = params.toString();
  return <Link className={className} href={query ? `/intake?${query}` : "/intake"}>{children}</Link>;
}
