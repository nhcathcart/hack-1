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
  Sparkles,
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
  accent: string;
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

const accents = [
  "from-rose-400 via-orange-300 to-yellow-300",
  "from-fuchsia-400 via-pink-400 to-red-300",
  "from-cyan-300 via-emerald-300 to-lime-300",
  "from-sky-400 via-indigo-400 to-violet-400",
  "from-amber-300 via-lime-300 to-emerald-400",
];

const stages = ["Recruiter screen", "Hiring manager", "Panel debrief", "Final loop"];
const locations = ["NYC HQ", "Remote", "Austin, TX", "Chicago, IL", "Denver, CO"];
const rounds = [
  "Mission fit + values",
  "Execution deep dive",
  "Customer scenario",
  "Cross-functional collaboration",
];

function slugFor(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const candidates: Candidate[] = teamMembers.map((member, index) => {
  const peerOne = teamMembers[(index + 7) % teamMembers.length];
  const peerTwo = teamMembers[(index + 13) % teamMembers.length];

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
    accent: accents[index % accents.length],
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
    className: "border-slate-200 bg-white text-slate-700",
  },
  {
    value: "Maybe",
    label: "Maybe",
    icon: Star,
    className: "border-amber-300 bg-amber-100 text-amber-800",
  },
  {
    value: "Like",
    label: "Like",
    icon: Check,
    className: "border-sky-300 bg-sky-100 text-sky-800",
  },
  {
    value: "Love",
    label: "Love",
    icon: Heart,
    className: "border-rose-300 bg-rose-100 text-rose-700",
  },
];

const decisionTone: Record<Decision, string> = {
  Love: "bg-rose-100 text-rose-700 ring-rose-200",
  Like: "bg-sky-100 text-sky-700 ring-sky-200",
  Maybe: "bg-amber-100 text-amber-800 ring-amber-200",
  Pass: "bg-slate-100 text-slate-700 ring-slate-200",
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState<Record<string, Feedback>>({});
  const [decision, setDecision] = useState<Decision>("Like");
  const [score, setScore] = useState(4);
  const [notes, setNotes] = useState("");

  const selected = candidates[index];
  const myFeedback = submitted[selected.id];
  const visibleFeedback = myFeedback
    ? [myFeedback, ...selected.feedback]
    : selected.feedback;

  const progress = useMemo(
    () => Math.round((Object.keys(submitted).length / candidates.length) * 100),
    [submitted]
  );

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
          "No notes entered. For the demo, this still counts as your read and unlocks the panel.",
      },
    }));
  }

  return (
    <main className="h-screen overflow-hidden bg-[#ffedd5] px-4 py-4 text-slate-950">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-4">
        <header className="shrink-0 rounded-[2rem] bg-white/85 p-4 shadow-xl ring-1 ring-orange-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg">
              <Sparkles className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                Talent Crush
              </h1>
              <p className="mt-1 text-sm font-bold uppercase tracking-wide text-rose-500">
                Swipe-style interview feedback, without the tiny phone cage
              </p>
            </div>
          </div>

          <div className="min-w-64">
            <div className="rounded-full bg-orange-100 p-1">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-lime-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-black uppercase tracking-wide text-slate-500">
              <span>{Object.keys(submitted).length} reviewed</span>
              <span>{candidates.length} candidates</span>
            </div>
          </div>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_410px]">
          <div className="grid min-h-0 gap-4 overflow-hidden xl:grid-cols-[340px_1fr]">
            <aside className="flex min-h-0 flex-col rounded-[2rem] bg-white/85 p-4 shadow-xl ring-1 ring-orange-100">
              <div className="mb-3 flex shrink-0 items-center justify-between">
                <div>
                  <div className="text-lg font-black">Candidate stack</div>
                  <div className="text-xs font-semibold text-slate-500">
                    Pick a profile to review.
                  </div>
                </div>
                <Badge className="bg-rose-100 text-rose-700">
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
                        "rounded-3xl p-3 text-left transition-transform hover:-translate-y-0.5",
                        isSelected
                          ? "bg-slate-950 text-white shadow-xl"
                          : "bg-white text-slate-950 ring-1 ring-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-slate-200 ring-2 ring-white/70">
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
                              "truncate text-xs font-semibold",
                              isSelected ? "text-white/70" : "text-slate-500"
                            )}
                          >
                            {candidate.role}
                          </div>
                        </div>
                        {isUnlocked ? (
                          <MessageCircle
                            className="size-4 text-lime-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <LockKeyhole
                            className={cn(
                              "size-4",
                              isSelected ? "text-white/60" : "text-slate-400"
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

            <article className="min-h-0 overflow-hidden rounded-[2.25rem] bg-white shadow-2xl ring-1 ring-orange-100">
              <div className={cn("h-60 bg-gradient-to-br p-5", selected.accent)}>
                <div className="flex items-start justify-between gap-3">
                  <Badge className="border-white/40 bg-white/90 text-slate-950">
                    {selected.stage}
                  </Badge>
                  <div className="rounded-full bg-white/90 px-4 py-2 text-lg font-black text-rose-600 shadow-sm">
                    {selected.match}% match
                  </div>
                </div>
                <div className="flex h-44 items-center justify-center">
                  <div className="relative size-40 overflow-hidden rounded-[2rem] bg-white/85 shadow-2xl ring-8 ring-white/50">
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
                    <h2 className="text-3xl font-black tracking-tight">
                      {selected.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold text-slate-600">
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
                      className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-transform hover:-translate-y-0.5"
                      aria-label="Previous candidate"
                    >
                      <ChevronLeft className="size-5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => selectCandidate(index + 1)}
                      className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-transform hover:-translate-y-0.5"
                      aria-label="Next candidate"
                    >
                      <ChevronRight className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="max-w-3xl text-base leading-7 text-slate-700">
                  {selected.summary}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-slate-700"
                      variant="outline"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="rounded-3xl bg-slate-950 p-4 text-white">
                  <div className="text-xs font-black uppercase tracking-wide text-rose-300">
                    Interview round
                  </div>
                  <div className="mt-1 text-base font-semibold">
                    {selected.interview}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="grid min-h-0 grid-rows-[auto_1fr] gap-4">
            <form
              className="rounded-[2rem] bg-white p-4 shadow-xl ring-1 ring-orange-100"
              onSubmit={submitFeedback}
            >
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Your private read
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Submit before the rest of the panel unlocks.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {decisionOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDecision(option.value)}
                      className={cn(
                        "flex h-14 items-center justify-center gap-2 rounded-2xl border-2 text-sm font-black transition-transform hover:-translate-y-0.5",
                        option.className,
                        decision === option.value
                          ? "border-slate-950 shadow-[4px_4px_0_#0f172a]"
                          : "border-transparent"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5",
                          option.value === "Love" ? "fill-current" : ""
                        )}
                        aria-hidden="true"
                      />
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-3xl bg-[#fef3c7] p-3 ring-1 ring-amber-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="score" className="text-sm font-black">
                    Chemistry score
                  </label>
                  <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-black text-slate-950 shadow-sm">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
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
                  className="mt-2 w-full accent-rose-500"
                />
              </div>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Drop your interview notes before peeking..."
                className="mt-4 min-h-20 w-full resize-none rounded-3xl border-0 bg-slate-50 px-4 py-3 text-sm shadow-inner outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus-visible:ring-3 focus-visible:ring-rose-200"
              />

              <Button
                type="submit"
                size="lg"
                className="mt-4 h-11 w-full gap-2 rounded-2xl bg-rose-500 text-base font-black text-white hover:bg-rose-600"
              >
                <Send className="size-4" aria-hidden="true" />
                {myFeedback ? "Update my read" : "Lock read and reveal"}
              </Button>
            </form>

            <section className="flex min-h-0 flex-col rounded-[2rem] bg-white p-4 shadow-xl ring-1 ring-orange-100">
              <div className="flex shrink-0 items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">
                    Panel messages
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {myFeedback
                      ? "Unlocked because you submitted your read."
                      : "Hidden until you submit your own read."}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "gap-1.5 rounded-full px-3 py-1",
                    myFeedback
                      ? "bg-lime-100 text-lime-800"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
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
                        {itemIndex > 0 ? <Separator className="mb-4" /> : null}
                        <article className="space-y-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="font-black">{item.author}</div>
                              <div className="text-xs font-medium text-slate-500">
                                {item.role} · {item.round} · {item.submittedAt}
                              </div>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-xs font-black ring-1",
                                decisionTone[item.decision]
                              )}
                            >
                              {item.decision} · {item.score}/5
                            </span>
                          </div>
                          <p className="text-sm leading-6 text-slate-700">
                            {item.notes}
                          </p>
                        </article>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl bg-slate-950 p-8 text-center text-white">
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/10">
                      <EyeOff className="size-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-black">No peeking yet</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/70">
                      Submit your own candidate read first. Then everyone else
                      appears instantly.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
