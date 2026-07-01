import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const stack = [
  "Next.js app router",
  "TypeScript",
  "Tailwind CSS v4",
  "shadcn/ui",
];

const metrics = [
  { label: "Components", value: "4" },
  { label: "Routes", value: "1" },
  { label: "Theme", value: "Neutral" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              hack-1
            </span>
          </div>
          <Badge variant="secondary">Ready to build</Badge>
        </header>

        <div className="grid flex-1 items-center gap-8 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="max-w-2xl space-y-7">
            <Badge className="gap-1.5" variant="outline">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              Next + shadcn
            </Badge>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
                A clean Next.js starter with shadcn/ui installed.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                The app router, Tailwind v4, TypeScript, and shadcn theme tokens
                are wired together so feature work can start immediately.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2">
                Start building
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline">
                View components
              </Button>
            </div>
          </div>

          <Card className="rounded-lg shadow-none">
            <CardHeader>
              <CardTitle>Project baseline</CardTitle>
              <CardDescription>
                Installed and configured with the shadcn registry defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="text-2xl font-semibold">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                {stack.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      </main>
  );
}
