import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getClientId } from "./client-id";

export interface CommandDef {
  id: string;
  label: string;
  description: string;
  group: "Navigate" | "AI" | "Dev" | "Notes";
  run: (ctx: CommandContext) => Promise<void> | void;
}

export interface CommandContext {
  navigate: (to: string) => void;
}

async function logCommand(command: string, status = "success") {
  try {
    await supabase.from("command_log").insert({
      command,
      status,
      client_id: getClientId(),
    });
  } catch {
    // never block UX
  }
}

export const COMMANDS: CommandDef[] = [
  {
    id: "go-dashboard",
    label: "Go to Dashboard",
    description: "Open the overview",
    group: "Navigate",
    run: async ({ navigate }) => {
      navigate("/dashboard");
      await logCommand("go-dashboard");
    },
  },
  {
    id: "go-notes",
    label: "Open Notes",
    description: "Browse and edit notes",
    group: "Navigate",
    run: async ({ navigate }) => {
      navigate("/dashboard/notes");
      await logCommand("go-notes");
    },
  },
  {
    id: "go-analytics",
    label: "Open Analytics",
    description: "Charts of recent activity",
    group: "Navigate",
    run: async ({ navigate }) => {
      navigate("/dashboard/analytics");
      await logCommand("go-analytics");
    },
  },
  {
    id: "go-commands",
    label: "Command Log",
    description: "Audit trail of every command",
    group: "Navigate",
    run: async ({ navigate }) => {
      navigate("/dashboard/commands");
      await logCommand("go-commands");
    },
  },
  {
    id: "go-assistant",
    label: "Open AI Assistant",
    description: "Chat with KingdomAI",
    group: "AI",
    run: async ({ navigate }) => {
      navigate("/dashboard/assistant");
      await logCommand("go-assistant");
    },
  },
  {
    id: "health-check",
    label: "/health-check",
    description: "Ping the backend and report latency",
    group: "Dev",
    run: async () => {
      const start = performance.now();
      const { error } = await supabase.from("notes").select("id").limit(1);
      const ms = Math.round(performance.now() - start);
      if (error) {
        toast.error(`Health check failed: ${error.message}`);
        await logCommand("health-check", "error");
      } else {
        toast.success(`Backend OK · ${ms}ms`);
        await logCommand("health-check");
      }
    },
  },
  {
    id: "audit-log",
    label: "/audit-log",
    description: "Show your last 5 commands",
    group: "Dev",
    run: async () => {
      const { data, error } = await supabase
        .from("command_log")
        .select("command, created_at")
        .eq("client_id", getClientId())
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.message("Recent commands", {
        description: data?.map((d) => d.command).join(" · ") || "none yet",
      });
      await logCommand("audit-log");
    },
  },
  {
    id: "ai-suggest",
    label: "/ai-suggest",
    description: "AI-powered next-step suggestion",
    group: "AI",
    run: async () => {
      const tips = [
        "Try `/health-check` to check backend latency.",
        "Open Analytics to see what people are running.",
        "Create a sticky note in Notes — they're public and live.",
        "Ask the AI Assistant for ideas on what to build next.",
      ];
      toast.message("KingdomAI suggests", {
        description: tips[Math.floor(Math.random() * tips.length)],
      });
      await logCommand("ai-suggest");
    },
  },
  {
    id: "new-note",
    label: "New note",
    description: "Create a blank note instantly",
    group: "Notes",
    run: async ({ navigate }) => {
      const { error } = await supabase.from("notes").insert({
        client_id: getClientId(),
        title: "Untitled",
        content: "",
        color: ["cyan", "magenta", "violet"][Math.floor(Math.random() * 3)],
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Note created");
        navigate("/dashboard/notes");
      }
      await logCommand("new-note");
    },
  },
];
