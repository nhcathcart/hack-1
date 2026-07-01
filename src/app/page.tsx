"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Heart,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Send,
  Star,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Decision = "Love" | "Like" | "Maybe" | "Pass";

type Feedback = {
  author: string;
  role: string;
  round: string;
  decision: Decision;
  score: number;
  submittedAt: string;
  notes: string;
};

type Candidate = {
  id: string;
  name: string;
  role: string;
  stage: string;
  location: string;
  interview: string;
  summary: string;
  tags: string[];
  match: number;
  image: string;
  sources: {
    granola: string;
    notion: string;
    whisper: string;
  };
  feedback: Feedback[];
};

const teamMembers = [
  {
    name: "Nikhil Reddy",
    title: "Co-Founder & CEO",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/4846a3c54ba104e52484e720f828de79c7bf3250-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "KJ Shah",
    title: "Co-Founder & COO",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/02ba704fb2ee936c9454ed653cc39111e7a12e12-864x840.png?auto=format&w=900&q=80",
  },
  {
    name: "John Puma",
    title: "Chief of Staff",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/f1d2f17b90da1bea0563032ea9ccfbf7367b79fa-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Michael Atkinson",
    title: "Head of Sales",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/4de7f2fe5e0da2fac24e3a49d2b923ca4c56dd05-720x720.png?auto=format&w=900&q=80",
  },
  {
    name: "Mac Marrone",
    title: "Head of Customer Operations",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/5c193149a50d590748107372085c84ca41c8dd3b-800x800.png?auto=format&w=900&q=80",
  },
  {
    name: "Lou Giacalone",
    title: "Engineering Lead",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/658cc0b87f1b776d1134c38844530070934ecae5-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Alyssa Placa",
    title: "Recruiting Lead",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/b430fc9851d3df77ed086e50018c3b1ab616bfd1-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "David Jones",
    title: "Proposal & Capture Lead",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/6e0ff2694cc5fcf7a8ce67943d970d53df60762d-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Kevin Dennehy",
    title: "Strategic Finance Lead",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/73676227e49bc97092af37a6a599aa5da3bbf1a0-512x512.png?auto=format&w=900&q=80",
  },
  {
    name: "Jeff Goldberg",
    title: "Account Executive",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/61521ad606219cf766b6206c8012e4ae232835b7-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Maureen Boyer",
    title: "Deployment Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/faae30e3ae39d9653f36a22c3d424bbfd30f8175-534x564.png?auto=format&w=900&q=80",
  },
  {
    name: "Daman Chatha",
    title: "Senior Product Designer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/d21b83c4a3c4f0824ebb987ec926e14b19031210-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Jared Carrow",
    title: "Customer Success Manager",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/6e674864081f428cde717fdc9ad08aeeafdba862-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Zach Wilner",
    title: "Principal Data Analyst",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/89a3a3422d1f71d4af12e19d52e808dfd3c2d7c2-8192x5464.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Steven Huynh",
    title: "Senior Engineer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/7771c89b680de68246d0d7f1e99cc31fea246ec9-983x984.png?auto=format&w=900&q=80",
  },
  {
    name: "Matt Abrams",
    title: "Proposal Writer and Capture Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/332ce30274e03e0fa68c3fd5f6d437a63874bd21-1024x1024.png?auto=format&w=900&q=80",
  },
  {
    name: "Patrick Hoyt",
    title: "Quality Engineer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/13cc7c0b9667b2da2b97147fbdcbe7a341d53ff2-512x512.png?auto=format&w=900&q=80",
  },
  {
    name: "Vivian Ellis",
    title: "Deployment Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/03e5b6338b1c55270cf26dca1d274d83c50ee9eb-800x800.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Ivy Li",
    title: "Senior Designer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/255a1e02b0da73907b6a1c2c0c8c9beaed2e61a7-800x800.png?auto=format&w=900&q=80",
  },
  {
    name: "Kara Vohra",
    title: "Deployment Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/3cc14dcce588f702fa2255c5fa463f96f950c583-664x664.png?auto=format&w=900&q=80",
  },
  {
    name: "Margo Mitchell",
    title: "Deployment Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/77a686cda28277a547af7513ab5d0413d2ebe1af-800x800.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Nico Turk",
    title: "Deployment Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/4538c641a7eb3e111a070ffc7cac7ed394c78ad9-800x800.jpg?auto=format&w=900&q=80",
  },
  {
    name: "Shaham Noorani",
    title: "Forward Deployed Software Engineer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/a22d9d93a6e92b19bf96c41222ddc9d1fbed8e07-697x697.png?auto=format&w=900&q=80",
  },
  {
    name: "Megan McCaffrey",
    title: "Regional Account Executive",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/84e2ff211870f477f45197a6d2e44cc1c2c5cc8b-800x800.png?auto=format&w=900&q=80",
  },
  {
    name: "Luis Avila",
    title: "Senior Recruiter",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/2760982f8e70826ddad05a508e3df5f0ed3a362e-390x418.png?auto=format&w=900&q=80",
  },
  {
    name: "Chelsea Friedberg",
    title: "Regional Account Executive",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/643db707a8930f1887b544023f6365fb2867a7e6-800x800.png?auto=format&w=900&q=80",
  },
  {
    name: "Michael Salib",
    title: "Deployment Strategist",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/56ab45847347136f2f6292b3b127517927778e3a-560x560.png?auto=format&w=900&q=80",
  },
  {
    name: "Christopher Johnson",
    title: "Data Engineer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/0c44e2798fb92ebd984882e8b99523a33e6e0a05-800x800.png?auto=format&w=900&q=80",
  },
  {
    name: "Sean O'Donnell",
    title: "Sr. Director of Growth",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/2018c53c6f4d1a3c672af41e17162024ac95a792-800x800.png?auto=format&w=900&q=80",
  },
  {
    name: "Jamie Goodin",
    title: "Software Engineer",
    image:
      "https://cdn.sanity.io/images/d0506ezu/production/44a88e2e33f226acd52c2d98b5acde66a315ac01-320x320.png?auto=format&w=900&q=80",
  },
];

const stages = ["Recruiter screen", "Hiring manager", "Panel debrief", "Final loop"];
const locations = ["NYC HQ", "Remote", "Austin, TX", "Chicago, IL", "Denver, CO"];
const rounds = [
  "Mission fit + values",
  "Execution deep dive",
  "Customer scenario",
  "Cross-functional collaboration",
];
const sourceThemes = [
  {
    strength: "translated an ambiguous agency problem into a concrete operating plan",
    concern: "could go deeper on how they measure success after launch",
    quote: "I want the resident experience to feel boring in the best possible way.",
  },
  {
    strength: "used a recent customer example to show strong judgment under pressure",
    concern: "needs one more example of influencing without direct authority",
    quote: "The hard part is not the software, it is earning trust with the team using it.",
  },
  {
    strength: "explained tradeoffs with unusually crisp sequencing and ownership",
    concern: "may need calibration on how quickly Kaizen expects decisions to move",
    quote: "I like constraints because they force the real priority to show up.",
  },
  {
    strength: "connected their craft directly to public-sector outcomes",
    concern: "gave a polished answer, so the panel should probe for messy details",
    quote: "If a workflow fails, someone in the real world waits longer.",
  },
  {
    strength: "showed strong pattern recognition from prior growth and deployment work",
    concern: "should clarify how they handle incomplete stakeholder alignment",
    quote: "A good launch plan makes the scary parts visible early.",
  },
];

function slugFor(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const candidates: Candidate[] = teamMembers.map((member, index) => {
  const peerOne = teamMembers[(index + 7) % teamMembers.length];
  const peerTwo = teamMembers[(index + 13) % teamMembers.length];
  const theme = sourceThemes[index % sourceThemes.length];

  return {
    id: slugFor(member.name),
    name: member.name,
    role: member.title,
    stage: stages[index % stages.length],
    location: locations[index % locations.length],
    interview: rounds[index % rounds.length],
    summary: `${member.name} is being calibrated for ${member.title}. The panel is looking for mission orientation, pace, ownership, and crisp communication under ambiguity.`,
    tags: [
      member.title.includes("Engineer") ? "Technical depth" : "Team signal",
      member.title.includes("Strateg") ? "Customer judgment" : "Execution",
      "Kaizen team",
    ],
    match: 72 + ((index * 7) % 27),
    image: member.image,
    sources: {
      granola: `Granola captured ${member.name}'s strongest moment: they ${theme.strength}. The notes flag that ${member.title} maps well to the current team need, especially around ${rounds[index % rounds.length].toLowerCase()}. Follow-up: ${theme.concern}.`,
      notion: `Notion scorecard for ${member.name}: recommended calibration is ${
        index % 3 === 0 ? "hire-bar confidence" : index % 3 === 1 ? "scope fit" : "team leverage"
      }. Evidence: ${member.name.split(" ")[0]} gave specific examples, named constraints, and stayed close to user outcomes. Risk to discuss: ${theme.concern}.`,
      whisper: `Whisper transcript pull quote from ${member.name}: "${theme.quote}" Tone read: ${
        index % 2 === 0 ? "direct, fast, and comfortable with ambiguity" : "thoughtful, measured, and collaborative"
      }. The recording suggests the panel should revisit one moment where the answer got abstract and ask for the concrete artifact or decision that followed.`,
    },
    feedback: [
      {
        author: peerOne.name,
        role: peerOne.title,
        round: rounds[(index + 1) % rounds.length],
        decision: index % 5 === 0 ? "Love" : "Like",
        score: index % 5 === 0 ? 5 : 4,
        submittedAt: index % 3 === 0 ? "Today" : "Yesterday",
        notes:
          "Strong signal on mission fit and operating pace. They were concrete about tradeoffs and stayed grounded in public-sector user outcomes.",
      },
      {
        author: peerTwo.name,
        role: peerTwo.title,
        round: rounds[(index + 2) % rounds.length],
        decision: index % 4 === 0 ? "Maybe" : "Like",
        score: index % 4 === 0 ? 3 : 4,
        submittedAt: index % 2 === 0 ? "9:17 AM" : "Mon",
        notes:
          "Good discussion overall. I would probe one more example around cross-functional conflict before making the final call.",
      },
    ],
  };
});

const decisionOptions: Array<{
  value: Decision;
  label: string;
  icon: typeof Heart;
  className: string;
}> = [
  {
    value: "Pass",
    label: "Pass",
    icon: X,
    className: "bg-surface-danger text-on-surface-danger",
  },
  {
    value: "Maybe",
    label: "Maybe",
    icon: Star,
    className: "bg-surface-secondary text-on-surface-secondary-default",
  },
  {
    value: "Like",
    label: "Like",
    icon: Check,
    className: "bg-surface-tertiary text-on-surface-primary-default",
  },
  {
    value: "Love",
    label: "Love",
    icon: Heart,
    className: "bg-surface-success text-on-surface-success",
  },
];

const decisionTone: Record<Decision, string> = {
  Love: "bg-surface-success text-on-surface-success",
  Like: "bg-surface-secondary text-on-surface-secondary-default",
  Maybe: "bg-surface-tertiary text-on-surface-primary-default",
  Pass: "bg-surface-danger text-on-surface-danger",
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState<Record<string, Feedback>>({});
  const [decision, setDecision] = useState<Decision>("Like");
  const [score, setScore] = useState(4);
  const [notes, setNotes] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState<keyof Candidate["sources"] | null>(
    null
  );

  const selected = candidates[index];
  const myFeedback = submitted[selected.id];
  const visibleFeedback = myFeedback
    ? [myFeedback, ...selected.feedback]
    : selected.feedback;

  const progress = useMemo(
    () => Math.round((Object.keys(submitted).length / candidates.length) * 100),
    [submitted]
  );

  const sourceLabels: Record<keyof Candidate["sources"], string> = {
    granola: "Granola notes",
    notion: "Notion notes",
    whisper: "Whisper notes",
  };

  function selectCandidate(nextIndex: number) {
    const normalized = (nextIndex + candidates.length) % candidates.length;
    const candidate = candidates[normalized];

    setIndex(normalized);
    setDecision(submitted[candidate.id]?.decision ?? "Like");
    setScore(submitted[candidate.id]?.score ?? 4);
    setNotes(submitted[candidate.id]?.notes ?? "");
  }

  function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted((current) => ({
      ...current,
      [selected.id]: {
        author: "You",
        role: "Interview panelist",
        round: "Your interview",
        decision,
        score,
        submittedAt: "Just now",
        notes:
          notes.trim() ||
          "No notes entered. For the demo, this still counts as your feedback and unlocks the panel.",
      },
    }));
  }

  return (
    <main className="h-screen overflow-hidden bg-surface-secondary px-4 py-4 text-on-surface-secondary-default">
      <div className="mx-auto flex h-full w-full max-w-page flex-col gap-4">
        <header className="shrink-0 rounded-3xl border border-stroke-default bg-surface-primary p-4 shadow-elevation">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden rounded-2xl border border-stroke-default bg-surface-primary shadow-elevation">
              <Image
                src="/kindling-logo.png"
                alt="Kindling logo"
                fill
                priority
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-on-surface-primary-default md:text-3xl">
                Kindling
              </h1>
              <p className="mt-1 text-sm font-medium text-on-surface-primary-subtle">
                Blinded hiring feedback in the Kaizen design system
              </p>
            </div>
          </div>

          <div className="min-w-64">
            <div className="rounded-full bg-surface-tertiary p-1">
              <div
                className="h-3 rounded-full bg-surface-inverse transition-all duration-base ease-move"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-medium uppercase tracking-wide text-on-surface-primary-subtle">
              <span>{Object.keys(submitted).length} submitted</span>
              <span>{candidates.length} candidates</span>
            </div>
          </div>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_480px]">
          <div className="grid min-h-0 gap-4 overflow-hidden xl:grid-cols-[340px_1fr]">
            <aside className="flex min-h-0 flex-col rounded-3xl border border-stroke-default bg-surface-primary p-4 shadow-elevation">
              <div className="mb-3 flex shrink-0 items-center justify-between">
                <div>
                  <div className="text-lg font-black text-on-surface-primary-default">
                    Candidate stack
                  </div>
                  <div className="text-xs font-normal text-on-surface-primary-subtle">
                    Pick a profile to review.
                  </div>
                </div>
                <Badge>
                  {index + 1}/{candidates.length}
                </Badge>
              </div>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {candidates.map((candidate, candidateIndex) => {
                  const isSelected = candidate.id === selected.id;
                  const isUnlocked = Boolean(submitted[candidate.id]);

                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => selectCandidate(candidateIndex)}
                      className={cn(
                        "block w-full rounded-2xl p-3 text-left transition-all duration-fast ease-move hover:-translate-y-0.5",
                        isSelected
                          ? "bg-surface-inverse text-on-surface-inverse-default shadow-elevation"
                          : "border border-stroke-default bg-surface-primary text-on-surface-primary-default hover:bg-surface-secondary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-tertiary">
                          <Image
                            src={candidate.image}
                            alt={`${candidate.name} headshot`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-black">
                            {candidate.name}
                          </div>
                          <div
                            className={cn(
                              "truncate text-xs font-normal",
                              isSelected
                                ? "text-on-surface-inverse-subtle"
                                : "text-on-surface-primary-subtle"
                            )}
                          >
                            {candidate.role}
                          </div>
                        </div>
                        {isUnlocked ? (
                          <MessageCircle
                            className={cn(
                              "size-4",
                              isSelected
                                ? "text-on-surface-inverse-default"
                                : "text-on-surface-primary-default"
                            )}
                            aria-hidden="true"
                          />
                        ) : (
                          <LockKeyhole
                            className={cn(
                              "size-4",
                              isSelected
                                ? "text-on-surface-inverse-subtle"
                                : "text-on-surface-primary-subtle"
                            )}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="min-h-0 overflow-hidden rounded-3xl border border-stroke-default bg-surface-primary shadow-elevation">
              <div className="h-60 bg-surface-inverse p-5">
                <div className="flex items-start justify-between gap-3">
                  <Badge>{selected.stage}</Badge>
                  <div className="rounded-full bg-surface-primary px-4 py-2 text-style-body-lg-semibold text-on-surface-primary-default shadow-elevation">
                    {selected.match}% fit
                  </div>
                </div>
                <div className="flex h-44 items-center justify-center">
                  <div className="relative size-40 overflow-hidden rounded-3xl border-4 border-surface-primary bg-surface-primary shadow-elevation">
                    <Image
                      src={selected.image}
                      alt={`${selected.name} headshot`}
                      fill
                      priority={index === 0}
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight text-on-surface-primary-default">
                      {selected.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm font-normal text-on-surface-primary-subtle">
                      <span className="flex items-center gap-1.5">
                        <BriefcaseBusiness className="size-4" aria-hidden="true" />
                        {selected.role}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4" aria-hidden="true" />
                        {selected.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => selectCandidate(index - 1)}
                      className="flex size-11 items-center justify-center rounded-full bg-surface-secondary text-on-surface-primary-default transition-all duration-fast ease-move hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
                      aria-label="Previous candidate"
                    >
                      <ChevronLeft className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => selectCandidate(index + 1)}
                      className="flex size-11 items-center justify-center rounded-full bg-surface-secondary text-on-surface-primary-default transition-all duration-fast ease-move hover:-translate-y-0.5 hover:bg-surface-secondary-hover"
                      aria-label="Next candidate"
                    >
                      <ChevronRight className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="max-w-prose text-base leading-7 text-on-surface-primary-subtle">
                  {selected.summary}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="rounded-2xl bg-surface-inverse p-4 text-on-surface-inverse-default">
                  <div className="text-xs font-black uppercase tracking-wide text-on-surface-inverse-subtle">
                    Interview round
                  </div>
                  <div className="mt-1 text-base font-semibold">
                    {selected.interview}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["granola", "notion", "whisper"] as const).map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setSourceOpen(source)}
                      className="rounded-2xl border border-stroke-default bg-surface-secondary px-3 py-2 text-sm font-black text-on-surface-primary-default transition-colors duration-fast ease-move hover:bg-surface-secondary-hover"
                    >
                      {sourceLabels[source]}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <aside className="grid min-h-0 grid-rows-2 gap-4">
            <form
              className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-stroke-default bg-surface-primary p-4 shadow-elevation"
              onSubmit={submitFeedback}
            >
              <div className="shrink-0">
                <h2 className="text-xl font-black tracking-tight text-on-surface-primary-default">
                  Your feedback
                </h2>
                <p className="mt-1 text-sm font-normal text-on-surface-primary-subtle">
                  Submit your read before the panel unlocks.
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {decisionOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setDecision(option.value)}
                        className={cn(
                          "flex h-11 items-center justify-center gap-1.5 rounded-2xl border-2 text-xs font-black transition-all duration-fast ease-move hover:-translate-y-0.5",
                          option.className,
                          decision === option.value
                            ? "border-stroke-emphasis shadow-elevation"
                            : "border-transparent"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4",
                            option.value === "Love" ? "fill-current" : ""
                          )}
                          aria-hidden="true"
                        />
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 rounded-2xl border border-stroke-default bg-surface-secondary p-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="score"
                      className="text-sm font-black text-on-surface-primary-default"
                    >
                    Score
                    </label>
                    <span className="flex items-center gap-1 rounded-full bg-surface-primary px-3 py-1 text-sm font-black text-on-surface-primary-default shadow-elevation">
                      <Star className="size-4 fill-current" />
                      {score}/5
                    </span>
                  </div>
                  <input
                    id="score"
                    type="range"
                    min="1"
                    max="5"
                    value={score}
                    onChange={(event) => setScore(Number(event.target.value))}
                    className="mt-2 w-full [accent-color:var(--color-surface-inverse)]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setNotesOpen(true)}
                  className="mt-3 flex h-10 w-full items-center justify-between rounded-2xl border border-stroke-default bg-surface-secondary px-4 text-left text-sm font-black text-on-surface-primary-default transition-colors duration-fast ease-move hover:bg-surface-secondary-hover"
                >
                  <span>Add notes</span>
                  <span className="text-xs font-normal text-on-surface-primary-subtle">
                    {notes.trim() ? "Added" : "Optional"}
                  </span>
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-3 w-full shrink-0"
              >
                <Send className="size-4" aria-hidden="true" />
                {myFeedback ? "Update feedback" : "Submit and reveal"}
              </Button>
            </form>

            <section className="flex min-h-0 flex-col rounded-3xl border border-stroke-default bg-surface-primary p-5 shadow-elevation">
              <div className="flex shrink-0 items-start justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-on-surface-primary-default">
                    Panel notes
                  </h2>
                  <p className="mt-1 text-sm font-normal text-on-surface-primary-subtle">
                    {myFeedback
                      ? "Unlocked because you submitted your read."
                      : "Hidden until you submit your own read."}
                  </p>
                </div>
                <Badge variant={myFeedback ? "success" : "default"}>
                  {myFeedback ? (
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                  ) : (
                    <LockKeyhole className="size-3.5" aria-hidden="true" />
                  )}
                  {myFeedback ? "Open" : "Locked"}
                </Badge>
              </div>

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                {myFeedback ? (
                  <div className="space-y-4">
                    {visibleFeedback.map((item, itemIndex) => (
                      <div key={`${item.author}-${item.round}`}>
                        {itemIndex > 0 ? <Separator className="mb-3" /> : null}
                        <article className="space-y-2 rounded-2xl border border-stroke-default bg-surface-secondary p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="font-black text-on-surface-primary-default">
                                {item.author}
                              </div>
                              <div className="text-xs font-normal text-on-surface-primary-subtle">
                                {item.role} · {item.round} · {item.submittedAt}
                              </div>
                            </div>
                            <span
                              className={cn(
                                "rounded-full border border-stroke-default px-3 py-1 text-xs font-black",
                                decisionTone[item.decision]
                              )}
                            >
                              {item.decision} · {item.score}/5
                            </span>
                          </div>
                          <p className="text-sm leading-5 text-on-surface-primary-subtle">
                            {item.notes}
                          </p>
                        </article>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-full flex-col items-center justify-center rounded-2xl bg-surface-inverse p-6 text-center text-on-surface-inverse-default">
                    <div className="flex size-14 items-center justify-center rounded-full bg-surface-primary/10">
                      <EyeOff className="size-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-black">Panel locked</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-on-surface-inverse-subtle">
                      Submit your own feedback first. Then everyone else&apos;s
                      notes appear instantly.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </div>

      {notesOpen ? (
        <div
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setNotesOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-stroke-default bg-white p-5 text-slate-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Feedback note
                </h2>
                <p className="mt-1 text-sm font-normal text-slate-600">
                  Add context without crowding the scorecard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNotesOpen(false)}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                aria-label="Close feedback note modal"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add the context you want captured before the panel opens..."
              className="mt-5 min-h-48 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus-visible:border-slate-950 focus-visible:ring-2 focus-visible:ring-slate-950/20"
            />

            <div className="mt-5 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setNotes("")}
              >
                Clear
              </Button>
              <Button type="button" onClick={() => setNotesOpen(false)}>
                Save note
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {sourceOpen ? (
        <div
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSourceOpen(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-stroke-default bg-white p-5 text-slate-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  {sourceLabels[sourceOpen]}
                </h2>
                <p className="mt-1 text-sm font-normal text-slate-600">
                  {selected.name} · {selected.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSourceOpen(null)}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
                aria-label="Close source modal"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-8 text-slate-700">
              {selected.sources[sourceOpen]}
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="button" onClick={() => setSourceOpen(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
