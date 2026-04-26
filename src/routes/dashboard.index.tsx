import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { COMMANDS } from "@/lib/commands";
import { Activity, Command, NotebookPen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Stat({ label, value, icon: Icon, delay = 0 }: { label: string; value: string | number; icon: typeof Activity; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--gradient-primary)" }} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <Icon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Overview() {
  const navigate = useNavigate();
  const [commandCount, setCommandCount] = useState<number | null>(null);
  const [noteCount, setNoteCount] = useState<number | null>(null);
  const [recent, setRecent] = useState<{ command: string; created_at: string }[]>([]);

  useEffect(() => {
    supabase
      .from("command_log")
      .select("command, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data, count }) => {
        setRecent(data ?? []);
        setCommandCount(count ?? 0);
      });
    supabase
      .from("notes")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setNoteCount(count ?? 0));
  }, []);

  const quick = COMMANDS.filter((c) => ["health-check", "ai-suggest", "new-note", "go-assistant"].includes(c.id));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome to the public workspace. Everything is live.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Commands run" value={commandCount ?? "—"} icon={Command} delay={0} />
        <Stat label="Notes on the wall" value={noteCount ?? "—"} icon={NotebookPen} delay={0.05} />
        <Stat label="Status" value="Healthy" icon={Activity} delay={0.1} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {quick.map((cmd) => (
            <Button
              key={cmd.id}
              variant="outline"
              onClick={() => cmd.run({ navigate: (to) => navigate({ to }) })}
            >
              {cmd.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No commands yet. Press <kbd className="rounded border border-border bg-muted px-1 font-mono text-xs">⌘K</kbd> to run one.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recent.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-2 text-sm">
                  <span className="font-mono">{r.command}</span>
                  <span className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
