import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/commands")({
  component: CommandsPage,
});

interface LogEntry {
  id: string;
  command: string;
  status: string;
  created_at: string;
}

function CommandsPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("command_log")
      .select("id, command, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setEntries(data ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Command Log</h1>
        <p className="text-sm text-muted-foreground">Audit trail of every command you've run.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet. Try ⌘K.</p>
          ) : (
            <ul className="divide-y divide-border">
              {entries.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{e.command}</span>
                    <Badge variant={e.status === "success" ? "secondary" : "destructive"} className="text-[10px]">
                      {e.status}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
