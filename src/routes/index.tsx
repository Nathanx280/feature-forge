import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Command, Shield, Gauge } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kingdom — Build modular apps faster" },
      { name: "description", content: "Auth, roles, dashboards, and a built-in command palette. Ship a real platform in days." },
    ],
  }),
  component: Index,
});

function Feature({ icon: Icon, title, body }: { icon: typeof Sparkles; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-[var(--shadow-glow)]">
      <div
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ background: "var(--gradient-primary)" }} />
          <span className="font-semibold tracking-tight">Kingdom</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/auth">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <section className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Modular full-stack starter
          </div>
          <h1
            className="mx-auto mt-6 max-w-3xl bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent sm:text-6xl"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            Ship a real platform, not a prompt-built toy.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Kingdom gives you auth, roles, a command palette, and an audit-logged dashboard out of the box. Add features one module at a time.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="shadow-[var(--shadow-glow)]">Start building</Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">See features</Button>
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">⌘K</kbd> anywhere once signed in.
          </p>
        </section>

        <section id="features" className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Shield} title="Roles & RLS" body="Admin, moderator, user. Enforced server-side." />
          <Feature icon={Command} title="Command palette" body="⌘K runs any command, logged to your audit trail." />
          <Feature icon={Gauge} title="Dashboard" body="Live stats, command history, quick actions." />
          <Feature icon={Sparkles} title="Extendable" body="Add modules without rewriting the core." />
        </section>
      </main>
    </div>
  );
}
