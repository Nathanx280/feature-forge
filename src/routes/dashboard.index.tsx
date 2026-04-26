import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { COMMANDS } from "@/lib/commands";
import { useNavigate } from "@tanstack/react-router";
import { Activity, Command, Shield } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: Overview,
});

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Activity }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function Overview() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [commandCount, setCommandCount] = useState<number | null>(null);
  const [recent, setRecent] = useState<{ command: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("command_log")
      .select("command, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data, count }) => {
        setRecent(data ?? []);
        setCommandCount(count ?? 0);
      });
  }, [user]);

  const quick = COMMANDS.filter((c) => ["health-check", "ai-suggest", "audit-log"].includes(c.id));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Here's what's happening.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Commands run" value={commandCount ?? "—"} icon={Command} />
        <Stat label="Active roles" value={roles.length} icon={Shield} />
        <Stat label="Status" value="Healthy" icon={Activity} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {quick.map((cmd) => (
            <Button
              key={cmd.id}
              variant="outline"
              onClick={() => cmd.run({ navigate: (to) => navigate({ to }), userId: user?.id ?? null })}
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
