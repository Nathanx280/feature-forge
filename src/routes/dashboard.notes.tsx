import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { getClientId } from "@/lib/client-id";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/notes")({
  component: NotesPage,
});

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  client_id: string;
  updated_at: string;
}

const COLORS: Record<string, string> = {
  cyan: "oklch(0.78 0.18 195)",
  magenta: "oklch(0.70 0.20 320)",
  violet: "oklch(0.65 0.20 280)",
};

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const clientId = typeof window !== "undefined" ? getClientId() : "";

  const load = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(100);
    setNotes((data ?? []) as Note[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("notes-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "notes" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const create = async () => {
    const colors = Object.keys(COLORS);
    const { error } = await supabase.from("notes").insert({
      client_id: clientId,
      title: "Untitled",
      content: "",
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    if (error) toast.error(error.message);
  };

  const update = async (id: string, patch: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
    await supabase.from("notes").update(patch).eq("id", id);
  };

  const remove = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes wall</h1>
          <p className="text-sm text-muted-foreground">
            Public sticky notes. Live-synced for everyone. Yours are highlighted.
          </p>
        </div>
        <Button onClick={create}>
          <Plus className="mr-1 h-4 w-4" /> New note
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No notes yet. Drop the first one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {notes.map((n) => {
              const mine = n.client_id === clientId;
              const accent = COLORS[n.color] ?? COLORS.cyan;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-elegant)]"
                  style={{ boxShadow: mine ? `0 0 0 1px ${accent}` : undefined }}
                >
                  <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
                  <Input
                    value={n.title}
                    onChange={(e) => update(n.id, { title: e.target.value })}
                    disabled={!mine}
                    className="mb-2 border-0 bg-transparent px-0 text-base font-semibold focus-visible:ring-0"
                  />
                  <Textarea
                    value={n.content}
                    onChange={(e) => update(n.id, { content: e.target.value })}
                    disabled={!mine}
                    placeholder={mine ? "Write something…" : "(read-only — not your note)"}
                    className="min-h-[100px] resize-none border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(n.updated_at).toLocaleString()}</span>
                    {mine && (
                      <button
                        onClick={() => remove(n.id)}
                        className="opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
