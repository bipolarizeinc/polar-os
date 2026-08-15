export type EtsaQuestionType = "rating" | "single" | "multi" | "text" | "challenge";

export type EtsaQuestion = {
  id: number;
  section: 1 | 2 | 3 | 4 | 5;
  type: EtsaQuestionType;
  prompt: string;
  options?: string[];
  maxWords?: number;
};

const scale5 = ["1", "2", "3", "4", "5"];

export const ETSA_QUESTIONS: EtsaQuestion[] = [
  { id: 1, section: 1, type: "rating", prompt: "How capable are you at taking a broad objective and turning it into an organized plan with priorities and next steps?", options: scale5 },
  { id: 2, section: 1, type: "rating", prompt: "How capable are you at generating original concepts, approaches, designs, messaging, or solutions?", options: scale5 },
  { id: 3, section: 1, type: "rating", prompt: "How capable are you at managing tasks through completion without repeated supervision?", options: scale5 },
  { id: 4, section: 1, type: "rating", prompt: "How capable are you at learning and using unfamiliar software, AI systems, digital platforms, or technical tools?", options: scale5 },
  { id: 5, section: 1, type: "rating", prompt: "How capable are you at explaining complex information clearly in writing?", options: scale5 },
  { id: 6, section: 1, type: "rating", prompt: "How capable are you at presenting, explaining, teaching, negotiating, or communicating ideas verbally?", options: scale5 },
  { id: 7, section: 1, type: "rating", prompt: "How capable are you at identifying what customers need and connecting those needs to something valuable?", options: scale5 },
  { id: 8, section: 1, type: "rating", prompt: "How capable are you at coordinating people, making decisions, establishing expectations, and accepting responsibility for outcomes?", options: scale5 },
  { id: 9, section: 1, type: "rating", prompt: "How capable are you at finding reliable information, comparing evidence, recognizing patterns, and drawing useful conclusions?", options: scale5 },
  { id: 10, section: 1, type: "rating", prompt: "How capable are you at maintaining accurate files, records, schedules, processes, or operational information?", options: scale5 },
  { id: 11, section: 1, type: "multi", prompt: "Select every category in which you have meaningful experience.", options: ["AI assistants/generative AI","Office/productivity software","Graphic design","Video/audio production","Website development","Coding/software development","Data analysis","CRM/customer management","Project management","Accounting/financial tools","Cybersecurity","Social media/marketing platforms","Document production","Automation/no-code tools","None","Other"] },
  { id: 12, section: 1, type: "single", prompt: "Which best describes your professional experience?", options: ["Primarily academic/personal learning","Entry-level or limited professional experience","Multiple completed professional projects","Several years of demonstrated professional responsibility","Advanced/specialized professional experience","Leadership or enterprise-level responsibility"] },
  { id: 13, section: 1, type: "text", prompt: "Describe one project, responsibility, business result, creative work, or accomplishment that best demonstrates what you can do." },
  { id: 14, section: 1, type: "text", prompt: "What skill have you learned faster or more successfully than most people around you?" },
  { id: 15, section: 1, type: "text", prompt: "Complete this sentence without naming a job title: Give me a difficult situation involving ______, and I am usually the person who can ______." },

  { id: 16, section: 2, type: "single", prompt: "A project you own is falling behind because another team member has not completed their work. What do you do first?", options: ["Finish their work myself.","Immediately escalate the person to management.","Identify the blocker, establish ownership, and create a recovery plan.","Wait to see whether they recover before intervening.","Reassign their responsibilities immediately."] },
  { id: 17, section: 2, type: "single", prompt: "You receive a task you've never performed before.", options: ["Wait for detailed instructions.","Research it, develop an approach, and verify major assumptions.","Immediately improvise a solution.","Ask someone else to complete it.","Decline because it is outside my experience."] },
  { id: 18, section: 2, type: "single", prompt: "A client describes an idea that makes very little sense.", options: ["Tell them the idea won't work.","Build exactly what they requested.","Ask questions until the underlying objective becomes clear.","Refer them elsewhere.","Replace their idea with what I think is better."] },
  { id: 19, section: 2, type: "single", prompt: "You discover an inefficient process everyone has been using for years.", options: ["Keep using it because it is established.","Quietly use my own process.","Document the problem and propose an improved process.","Complain about it to coworkers.","Replace it immediately without approval."] },
  { id: 20, section: 2, type: "single", prompt: "You receive conflicting instructions from two leaders.", options: ["Follow the highest-ranking person's instruction.","Choose whichever instruction I prefer.","Surface the conflict and clarify the controlling objective.","Do nothing until they resolve it themselves.","Attempt both simultaneously."] },
  { id: 21, section: 2, type: "single", prompt: "A deadline becomes unrealistic.", options: ["Hide the problem and work longer.","Miss the deadline and explain afterward.","Raise the risk early and propose scope, resource, or timing alternatives.","Blame the original estimate.","Sacrifice quality to meet the date."] },
  { id: 22, section: 2, type: "single", prompt: "Your work receives strong criticism.", options: ["Defend every decision.","Accept every suggestion automatically.","Separate useful feedback from preference and revise accordingly.","Lose confidence in the work.","Ignore the criticism."] },
  { id: 23, section: 2, type: "single", prompt: "You notice an important error made by someone senior to you.", options: ["Ignore it.","Publicly correct them.","Verify the issue and raise it respectfully with evidence.","Quietly fix it without telling anyone.","Tell coworkers first."] },
  { id: 24, section: 2, type: "single", prompt: "You are given several urgent tasks at once.", options: ["Start whichever seems easiest.","Work on all of them simultaneously.","Rank them by consequence, dependency, deadline, and effort.","Ask someone else to prioritize everything.","Choose the most interesting task."] },
  { id: 25, section: 2, type: "single", prompt: "A teammate repeatedly asks for help.", options: ["Always complete the task for them.","Stop helping.","Help identify the recurring knowledge gap and teach the process.","Immediately report them.","Continue answering individual questions indefinitely."] },
  { id: 26, section: 2, type: "single", prompt: "A customer asks for something outside the current service.", options: ["Say no.","Promise it anyway.","Determine the underlying need and identify an appropriate solution or escalation.","Ignore the request.","Create an entirely new service immediately."] },
  { id: 27, section: 2, type: "single", prompt: "You find two credible sources that contradict each other.", options: ["Use the first source.","Use whichever supports my position.","Compare methodology, authority, date, context, and supporting evidence.","Average their conclusions.","Stop researching."] },
  { id: 28, section: 2, type: "single", prompt: "You develop a strong idea that management rejects.", options: ["Keep arguing until accepted.","Abandon it permanently.","Understand the objection, preserve the useful work, and revisit if evidence changes.","Implement it secretly.","Take the rejection personally."] },
  { id: 29, section: 2, type: "single", prompt: "A project has no established procedure.", options: ["Wait until someone writes one.","Improvise without documenting anything.","Establish a provisional workflow, test it, and document what works.","Copy another company's process exactly.","Avoid the project."] },
  { id: 30, section: 2, type: "single", prompt: "A project succeeds largely because of your contribution.", options: ["Claim primary credit.","Say nothing.","Document the contribution while recognizing the team's work.","Let someone senior take credit.","Use the success to criticize weaker teammates."] },
  { id: 31, section: 2, type: "single", prompt: "Someone disagrees strongly with your approach.", options: ["Try to win the argument.","Give in.","Compare objectives, assumptions, evidence, and tradeoffs.","Avoid working with them.","Ask management to decide immediately."] },
  { id: 32, section: 2, type: "single", prompt: "You realize halfway through a task that your original approach was wrong.", options: ["Continue because you've already invested time.","Hide the mistake.","Reassess, change course, and communicate material consequences.","Start completely over without analysis.","Ask someone else to take over."] },
  { id: 33, section: 2, type: "single", prompt: "You're asked to use AI for an important deliverable.", options: ["Accept its output as correct.","Refuse to use AI.","Use AI as a tool while independently verifying important outputs.","Have AI perform the entire assignment without review.","Only use AI for formatting."] },
  { id: 34, section: 2, type: "single", prompt: "A repetitive task consumes several hours every week.", options: ["Accept it as part of the job.","Rush through it.","Investigate templates, automation, delegation, or process redesign.","Stop doing it.","Ask someone else to handle it."] },
  { id: 35, section: 2, type: "single", prompt: "Your responsibilities suddenly expand.", options: ["Attempt everything without changing anything.","Refuse additional responsibility.","Reassess priorities, resources, systems, and capacity.","Work indefinitely longer hours.","Immediately delegate everything new."] },

  { id: 36, section: 3, type: "single", prompt: "A business has a website outage affecting customers, a presentation due tomorrow, an internal filing task due Friday, and three unread routine emails. What should generally receive attention first?", options: ["Emails","Presentation","Website outage","Filing","Whichever arrived first"] },
  { id: 37, section: 3, type: "single", prompt: "Sales decline immediately after website traffic remains stable but checkout completion drops sharply. What should be investigated first?", options: ["Employee attendance","Checkout/payment funnel","Logo design","Social follower count","Office expenses"] },
  { id: 38, section: 3, type: "single", prompt: "A five-stage process can handle 100, 100, 25, 100, and 100 units per day. Approximately what is the system's maximum daily throughput?", options: ["25","100","125","400","425"] },
  { id: 39, section: 3, type: "single", prompt: "A website cannot launch until payment processing is configured. Marketing cannot begin until the website launches. Which task is the critical upstream dependency?", options: ["Marketing","Payment processing","Social media","Graphic design","Analytics"] },
  { id: 40, section: 3, type: "single", prompt: "Which provides the strongest evidence that a new service has market demand?", options: ["The founder likes it.","Competitors offer something similar.","Social media users say it sounds cool.","Customers repeatedly pay for or commit to the solution.","The service has a strong logo."] },
  { id: 41, section: 3, type: "single", prompt: "A service sells for $500 and directly costs $150 to fulfill. What is the gross contribution before overhead?", options: ["$150","$350","$500","$650","Cannot be determined"] },
  { id: 42, section: 3, type: "single", prompt: "Customer complaints repeatedly mention confusing onboarding, even though product satisfaction after onboarding is high. Where is the strongest improvement opportunity?", options: ["Product replacement","Onboarding experience","Pricing increase","Employee uniforms","Brand colors"] },
  { id: 43, section: 3, type: "single", prompt: "A client continually requests additions beyond an agreed project scope. Best response?", options: ["Complete everything free.","Refuse all future changes.","Document requested changes and evaluate impact on scope, price, and timeline.","Ignore them.","Cancel the project."] },
  { id: 44, section: 3, type: "single", prompt: "Which source should generally receive the greatest initial confidence for a regulatory requirement?", options: ["Anonymous forum comment","Influencer video","Official government/regulatory publication","Competitor advertisement","Unsourced AI response"] },
  { id: 45, section: 3, type: "single", prompt: "Before automating a broken workflow, what should generally happen first?", options: ["Buy software.","Understand and improve the workflow.","Hire more people.","Automate every step immediately.","Eliminate documentation."] },
  { id: 46, section: 3, type: "single", prompt: "Three projects have projected values of $20,000, $8,000, and $2,000. The highest-value project is also the most time-sensitive and strategically important. With limited resources, what is the strongest default decision?", options: ["Divide resources equally.","Prioritize the highest-value critical project while protecting essential commitments.","Complete the smallest project first.","Randomly assign resources.","Delay all three."] },
  { id: 47, section: 3, type: "single", prompt: "You receive incomplete information for an irreversible high-impact decision.", options: ["Guess quickly.","Delay forever.","Identify the minimum critical information needed before committing.","Follow intuition exclusively.","Copy a previous decision."] },
  { id: 48, section: 3, type: "single", prompt: "Which approach provides the strongest protection against an important error?", options: ["Assume experienced people don't make mistakes.","Review only when a customer complains.","Establish defined validation/checkpoints appropriate to the risk.","Add more meetings.","Make one person responsible for everything."] },
  { id: 49, section: 3, type: "single", prompt: "A feature customers rarely use consumes 30% of development resources. What should happen first?", options: ["Immediately delete it.","Keep it forever.","Examine usage, customer value, dependencies, and opportunity cost.","Increase marketing for it automatically.","Double development resources."] },
  { id: 50, section: 3, type: "single", prompt: "Improving one department's speed causes twice as many errors downstream. Was the original change successful?", options: ["Yes, because the department became faster.","No, because local optimization harmed total-system performance.","Yes, because speed is always the priority.","Cannot ever be evaluated.","Only if employees preferred it."] },

  ...[
    "I can make progress when instructions define the objective but not every step.",
    "I naturally organize information that other people consider chaotic.",
    "I enjoy identifying patterns and connections across seemingly unrelated information.",
    "I prefer solving unfamiliar problems over repeatedly performing familiar tasks.",
    "I can follow an established procedure even when I did not design it.",
    "When I find a better method, I document it so others can reproduce it.",
    "I am comfortable explaining complicated ideas in simple language.",
    "I can disagree with someone while continuing to work effectively with them.",
    "I actively seek evidence that could prove my original assumption wrong.",
    "I can distinguish between an urgent task and an important task.",
    "I am comfortable taking ownership of an outcome, including when it fails.",
    "I notice inconsistencies, missing information, or potential risks that others sometimes overlook.",
    "I enjoy helping other people improve their performance.",
    "I consider how work creates customer, operational, or financial value rather than simply whether the task was completed.",
    "I can learn unfamiliar technology without requiring formal classroom instruction."
  ].map((prompt, index) => ({ id: 51 + index, section: 4 as const, type: "rating" as const, prompt, options: scale5 })),

  { id: 66, section: 5, type: "challenge", prompt: "A founder says: I need the business launched fast. We need customers, the website isn't finished, payments aren't set up, our branding is mostly done, I have about $1,500 available, and I'm not sure what needs to happen first. In five steps or fewer, explain what you would do first and why." },
  { id: 67, section: 5, type: "challenge", prompt: "Explain artificial intelligence to a business owner who has almost no technical knowledge.", maxWords: 100 },
  { id: 68, section: 5, type: "challenge", prompt: "A small company sells an ordinary service offered by dozens of competitors. Provide three different ways the company could differentiate itself without simply lowering its price." },
  { id: 69, section: 5, type: "challenge", prompt: "You are preparing an important client deliverable using information generated partly by AI. Identify at least four things you would verify before delivery." },
  { id: 70, section: 5, type: "challenge", prompt: "You are assigned an important project requiring a skill you currently do not possess. Explain how you would determine whether to learn it yourself, ask for assistance, delegate it, or recommend another resource.", maxWords: 150 }
];

export const ETSA_SECTION_TITLES = {
  1: "Talent Inventory",
  2: "Behavioral Alignment",
  3: "Cognitive & Problem-Solving",
  4: "Workstyle & Operational Fit",
  5: "Applied Challenges"
} as const;
