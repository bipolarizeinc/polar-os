import type { ReactNode } from "react";
import Link from "next/link";

export function IntakeLink({
  className = "primary-action",
  children = <><span>TELL US ABOUT YOUR THING</span><span>↗</span></>,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <Link className={className} href="/intake">{children}</Link>;
}
