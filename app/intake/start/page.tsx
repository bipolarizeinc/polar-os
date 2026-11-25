import type { Metadata } from "next";
import QuickIntakeForm from "./QuickIntakeForm";

export const metadata: Metadata = {
  title: "Start Your Extraction Intake",
  description: "Tell BI POLARIZE what you’re building, what’s blocking it, and how to reach you.",
  alternates: { canonical: "/intake/start" },
  openGraph: {
    title: "Start Your Extraction Intake | BI POLARIZE",
    description: "Start the conversation with three answers. No purchase required.",
    url: "/intake/start",
  },
};

export default function StartIntakePage() {
  return <QuickIntakeForm />;
}
