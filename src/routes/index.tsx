import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Command, Gauge, NotebookPen, Bot, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kingdom v2000 — Build modular apps faster" },
      {
        name: "description",
        content:
          "Public AI-powered modular starter. Notes, analytics, command palette and a streaming AI assistant — no sign-in required.",
      },
      { property: "og:title", content: "Kingdom v2000" },
      { property: "og:description", content: "AI-powered modular app starter. No sign-in needed." },
    ],
  }),
  component: Index,
});

function Feature({
  icon: Icon,
  title,
  body,
  delay = 0,
}: {
  icon: typeof Sparkles;
  title: string;
  body: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
    >
      <div
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function Orb({ className, color }: { className: string; color: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: color, opacity: 0.35 }}
    />
  );
}

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Orb className="-top-32 -left-24 h-96 w-96" color="oklch(0.78 0.18 195)" />
      <Orb className="top-40 -right-24 h-[28rem] w-[28rem]" color="oklch(0.70 0.20 320)" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="h-8 w-8 rounded-lg shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          />
          <span className="font-semibold tracking-tight">
            Kingdom <span className="text-primary">v2000</span>
          </span>
        </Link>
        <Link to="/dashboard">
          <Button size="sm" className="shadow-[var(--shadow-glow)]">
            Enter app <Zap className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-12">
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            v2000 · AI-powered · public access
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mx-auto mt-6 max-w-3xl bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent sm:text-6xl"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            The modular platform that builds with you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Notes, analytics, a streaming AI assistant and a command palette — all in one
            sleek dashboard. No sign-in. Just open and ship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <Link to="/dashboard">
              <Button size="lg" className="shadow-[var(--shadow-glow)]">
                Launch dashboard
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Tour the features
              </Button>
            </a>
          </motion.div>

          <p className="mt-4 text-xs text-muted-foreground">
            Press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono">⌘K</kbd>{" "}
            anywhere for the command palette.
          </p>
        </section>

        <section id="features" className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature icon={Bot} title="Streaming AI assistant" body="Token-by-token replies powered by Lovable AI." delay={0} />
          <Feature icon={Command} title="Command palette" body="⌘K runs commands, every action audit-logged." delay={0.05} />
          <Feature icon={NotebookPen} title="Public notes" body="Sticky-style notes that anyone can drop into the wall." delay={0.1} />
          <Feature icon={Gauge} title="Live analytics" body="Realtime charts of activity across the platform." delay={0.15} />
          <Feature icon={Sparkles} title="Modular by design" body="Add modules without touching the core." delay={0.2} />
          <Feature icon={Zap} title="Zero friction" body="No accounts, no setup. Open and use." delay={0.25} />
        </section>
      </main>
    </div>
  );
}
