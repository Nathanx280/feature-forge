import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsPage,
});

interface LogRow {
  command: string;
  status: string;
  created_at: string;
}

const PALETTE = [
  "oklch(0.78 0.18 195)",
  "oklch(0.70 0.20 320)",
  "oklch(0.75 0.18 250)",
  "oklch(0.80 0.18 150)",
  "oklch(0.78 0.20 60)",
];

function AnalyticsPage() {
  const [rows, setRows] = useState<LogRow[]>([]);

  useEffect(() => {
    supabase
      .from("command_log")
      .select("command, status, created_at")
      .order("created_at", { ascending: false })
      .limit(500)
      .then(({ data }) => setRows((data ?? []) as LogRow[]));
  }, []);

  const byCommand = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.command, (map.get(r.command) ?? 0) + 1));
    return Array.from(map, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [rows]);

  const byHour = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const key = `${d.getHours()}:00`;
      map.set(key, 0);
    }
    rows.forEach((r) => {
      const d = new Date(r.created_at);
      if (now.getTime() - d.getTime() < 24 * 60 * 60 * 1000) {
        const key = `${d.getHours()}:00`;
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    });
    return Array.from(map, ([hour, count]) => ({ hour, count }));
  }, [rows]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Live view of platform activity.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Last 24 hours</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.03 265)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "oklch(0.68 0.03 255)" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "oklch(0.68 0.03 255)" }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.20 0.025 265)",
                    border: "1px solid oklch(0.30 0.03 265)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="oklch(0.78 0.18 195)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top commands</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 280 }}>
            {byCommand.length === 0 ? (
              <p className="pt-12 text-center text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCommand}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {byCommand.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.20 0.025 265)",
                      border: "1px solid oklch(0.30 0.03 265)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Command leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {byCommand.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commands yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {byCommand.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: PALETTE[i % PALETTE.length] }}
                    />
                    <span className="font-mono">{c.name}</span>
                  </div>
                  <span className="text-muted-foreground">{c.value} runs</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
