"use client";

import { FormEvent, useMemo, useState } from "react";
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
  initials: string;
  accent: string;
  feedback: Feedback[];
};

const candidates: Candidate[] = [
  {
    id: "maya",
    name: "Maya Chen",
    role: "Senior Product Engineer",
    stage: "Panel debrief",
    location: "Austin, TX",
    interview: "System design + product sense",
    summary:
      "Builds crisp product architecture and makes tradeoffs that sound like they came from a real launch room.",
    tags: ["Frontend systems", "Product-minded", "React"],
    match: 94,
    initials: "MC",
    accent: "from-rose-400 via-orange-300 to-yellow-300",
    feedback: [
      {
        author: "Ari Patel",
        role: "Engineering Manager",
        round: "System design",
        decision: "Love",
        score: 5,
        submittedAt: "8:42 AM",
        notes:
          "Maya decomposed realtime editing well, named failure modes, and made pragmatic calls around presence, autosave, and conflict handling.",
      },
      {
        author: "Jordan Lee",
        role: "Staff Engineer",
        round: "Code review",
        decision: "Like",
        score: 4,
        submittedAt: "9:17 AM",
        notes:
          "Strong debugging instincts. I would want more observability depth, but the implementation conversation was focused and collaborative.",
      },
    ],
  },
  {
    id: "noah",
    name: "Noah Williams",
    role: "Growth Designer",
    stage: "Hiring manager",
    location: "Remote",
    interview: "Portfolio review",
    summary:
      "Sharp visual craft, good funnel instincts, and a strong habit of turning vague prompts into testable bets.",
    tags: ["Conversion", "Design systems", "Figma"],
    match: 88,
    initials: "NW",
    accent: "from-fuchsia-400 via-pink-400 to-red-300",
    feedback: [
      {
        author: "Priya Shah",
        role: "Design Lead",
        round: "Portfolio",
        decision: "Like",
        score: 4,
        submittedAt: "Yesterday",
        notes:
          "Noah can explain why design choices moved metrics. Some case studies were polished, but the follow-up details checked out.",
      },
      {
        author: "Marcus Reed",
        role: "PM",
        round: "Product collaboration",
        decision: "Like",
        score: 4,
        submittedAt: "Yesterday",
        notes:
          "Good partner energy. He pushed back on a vague prompt and turned it into a measurable onboarding test.",
      },
    ],
  },
  {
    id: "sofia",
    name: "Sofia Garcia",
    role: "Data Scientist",
    stage: "Technical screen",
    location: "Chicago, IL",
    interview: "Modeling exercise",
    summary:
      "Careful with assumptions, strong stats fundamentals, still warming up on product storytelling.",
    tags: ["Causal inference", "Python", "Experimentation"],
    match: 76,
    initials: "SG",
    accent: "from-cyan-300 via-emerald-300 to-lime-300",
    feedback: [
      {
        author: "Elena Torres",
        role: "Data Science Manager",
        round: "Modeling",
        decision: "Like",
        score: 4,
        submittedAt: "Mon",
        notes:
          "Sofia caught leakage in the sample data and picked a simpler model for the right reasons. Communication was accurate but a little dense.",
      },
      {
        author: "Theo Martin",
        role: "Product Analyst",
        round: "Case study",
        decision: "Maybe",
        score: 3,
        submittedAt: "Mon",
        notes:
          "Technically strong, but needed prompting to connect the analysis to launch decisions. Could be coachable.",
      },
    ],
  },
  {
    id: "liam",
    name: "Liam O'Connor",
    role: "Customer Success Lead",
    stage: "Final loop",
    location: "Denver, CO",
    interview: "Executive presentation",
    summary:
      "Calm operator for escalations, renewals, and the kind of customer rituals that make teams look prepared.",
    tags: ["Enterprise", "Renewals", "Playbooks"],
    match: 97,
    initials: "LO",
    accent: "from-sky-400 via-indigo-400 to-violet-400",
    feedback: [
      {
        author: "Samira Khan",
        role: "VP Customer",
        round: "Executive presentation",
        decision: "Love",
        score: 5,
        submittedAt: "Today",
        notes:
          "Liam mapped customer risk to specific operating cadences. The mock QBR was confident without feeling scripted.",
      },
      {
        author: "Devon Blake",
        role: "Solutions Architect",
        round: "Cross-functional",
        decision: "Like",
        score: 4,
        submittedAt: "Today",
        notes:
          "He knew when to pull in technical partners and when to keep the customer conversation outcome-focused.",
      },
    ],
  },
];

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
    <main className="min-h-screen bg-[#ffedd5] px-4 py-6 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-5">
        <header className="flex flex-col gap-4 rounded-[2rem] bg-white/85 p-5 shadow-xl ring-1 ring-orange-100 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg">
              <Sparkles className="size-7" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
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
        </header>

        <section className="grid flex-1 gap-5 lg:grid-cols-[1fr_430px]">
          <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
            <aside className="rounded-[2rem] bg-white/85 p-4 shadow-xl ring-1 ring-orange-100">
              <div className="mb-3 flex items-center justify-between">
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

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
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
                        <div
                          className={cn(
                            "flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-black text-white",
                            candidate.accent
                          )}
                        >
                          {candidate.initials}
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

            <article className="overflow-hidden rounded-[2.25rem] bg-white shadow-2xl ring-1 ring-orange-100">
              <div className={cn("min-h-80 bg-gradient-to-br p-6", selected.accent)}>
                <div className="flex items-start justify-between gap-3">
                  <Badge className="border-white/40 bg-white/90 text-slate-950">
                    {selected.stage}
                  </Badge>
                  <div className="rounded-full bg-white/90 px-4 py-2 text-lg font-black text-rose-600 shadow-sm">
                    {selected.match}% match
                  </div>
                </div>
                <div className="flex min-h-56 items-center justify-center">
                  <div className="flex size-44 items-center justify-center rounded-[2.25rem] bg-white/85 text-6xl font-black text-slate-950 shadow-2xl ring-8 ring-white/50">
                    {selected.initials}
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight">
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

                <p className="max-w-3xl text-lg leading-8 text-slate-700">
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

                <div className="rounded-3xl bg-slate-950 p-5 text-white">
                  <div className="text-xs font-black uppercase tracking-wide text-rose-300">
                    Interview round
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {selected.interview}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-5">
            <form
              className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-orange-100"
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

              <div className="mt-5 grid grid-cols-2 gap-3">
                {decisionOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDecision(option.value)}
                      className={cn(
                        "flex h-20 items-center justify-center gap-2 rounded-3xl border-2 text-base font-black transition-transform hover:-translate-y-0.5",
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

              <div className="mt-5 rounded-3xl bg-[#fef3c7] p-4 ring-1 ring-amber-200">
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
                  className="mt-4 w-full accent-rose-500"
                />
              </div>

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Drop your interview notes before peeking..."
                className="mt-5 min-h-32 w-full resize-none rounded-3xl border-0 bg-slate-50 px-4 py-3 text-sm shadow-inner outline-none ring-1 ring-slate-200 placeholder:text-slate-400 focus-visible:ring-3 focus-visible:ring-rose-200"
              />

              <Button
                type="submit"
                size="lg"
                className="mt-5 h-12 w-full gap-2 rounded-2xl bg-rose-500 text-base font-black text-white hover:bg-rose-600"
              >
                <Send className="size-4" aria-hidden="true" />
                {myFeedback ? "Update my read" : "Lock read and reveal"}
              </Button>
            </form>

            <section className="rounded-[2rem] bg-white p-5 shadow-xl ring-1 ring-orange-100">
              <div className="flex items-start justify-between gap-3">
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

              <div className="mt-5">
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
