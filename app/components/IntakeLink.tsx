import type { ReactNode } from "react";

const subject = "Tell Us About Your Thing — P.O.L.A.R. Intake";

const body = `BI POLARIZE ENTERPRISES, INC.
P.O.L.A.R. BLUEPRINT INTAKE

Please answer what you can. Raw, incomplete, and unconventional is welcome.

1. WHAT IS YOUR THING?
Describe the idea, business, invention, project, problem, or transformation.

Answer:


2. WHO IS IT FOR?
Who needs it, uses it, buys it, or benefits from it?

Answer:


3. WHAT PROBLEM DOES IT SOLVE?
What is broken, missing, inefficient, misunderstood, or ready to change?

Answer:


4. WHAT IS BLOCKING IT RIGHT NOW?
Tell us about the confusion, risk, missing structure, resources, technology, funding, knowledge, or bottleneck.

Answer:


5. WHAT SHOULD IT BECOME?
Describe the functional outcome, business model, revenue goal, impact, or future you are aiming for.

Answer:


6. WHAT ALREADY EXISTS?
Share any research, documents, prototypes, websites, branding, systems, partners, or prior work.

Answer:


7. WHAT KIND OF HELP DO YOU THINK YOU NEED?
It is fine if you are unsure.

Answer:


8. TIMELINE, BUDGET, OR IMPORTANT CONSTRAINTS
Include any deadlines, budget range, legal concerns, confidentiality needs, or non-negotiables.

Answer:


9. YOUR CONTACT INFORMATION
Name:
Company or project:
Phone:
Preferred contact method:
Best time to reach you:

10. ANYTHING ELSE P.O.L.A.R. SHOULD KNOW?

Answer:


Submitted through PolarPaw.Online`;

export const intakeEmailHref = `mailto:YourThing@PolarPaw.Online?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export function IntakeLink({
  className = "primary-action",
  children = <><span>TELL US ABOUT YOUR THING</span><span>↗</span></>,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <a className={className} href={intakeEmailHref}>{children}</a>;
}
