import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CommandDef {
  id: string;
  label: string;
  description: string;
  group: "Core" | "AI" | "Dev" | "Dashboard";
  run: (ctx: CommandContext) => Promise<void> | void;
}

export interface CommandContext {
  navigate: (to: string) => void;
  userId: string | null;
}

async function logCommand(userId: string | null, command: string, status = "success") {
  if (!userId) return;
  await supabase.from("command_log").insert({ user_id: userId, command, status });
}

export const COMMANDS: CommandDef[] = [
  {
    id: "go-dashboard",
    label: "Go to Dashboard",
    description: "Open the main dashboard",
    group: "Core",
    run: async ({ navigate, userId }) => {
      navigate("/dashboard");
      await logCommand(userId, "go-dashboard");
    },
  },
  {
    id: "go-commands",
    label: "Open Command Log",
    description: "View your command history",
    group: "Dev",
    run: async ({ navigate, userId }) => {
      navigate("/dashboard/commands");
      await logCommand(userId, "go-commands");
    },
  },
  {
    id: "go-profile",
    label: "Open Profile",
    description: "Edit your profile",
    group: "Core",
    run: async ({ navigate, userId }) => {
      navigate("/dashboard/profile");
      await logCommand(userId, "go-profile");
    },
  },
  {
    id: "health-check",
    label: "/health-check",
    description: "Ping the backend and confirm session",
    group: "Dev",
    run: async ({ userId }) => {
      const start = performance.now();
      const { error } = await supabase.from("profiles").select("id").limit(1);
      const ms = Math.round(performance.now() - start);
      if (error) {
        toast.error(`Health check failed: ${error.message}`);
        await logCommand(userId, "health-check", "error");
      } else {
        toast.success(`Backend OK · ${ms}ms`);
        await logCommand(userId, "health-check");
      }
    },
  },
  {
    id: "audit-log",
    label: "/audit-log",
    description: "Show the latest 5 commands you ran",
    group: "Dev",
    run: async ({ userId }) => {
      const { data, error } = await supabase
        .from("command_log")
        .select("command, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) return toast.error(error.message);
      toast.message("Recent commands", {
        description: data?.map((d) => d.command).join(" · ") || "none yet",
      });
      await logCommand(userId, "audit-log");
    },
  },
  {
    id: "ai-suggest",
    label: "/ai-suggest",
    description: "Get an AI-style suggestion for your next move",
    group: "AI",
    run: async ({ userId }) => {
      const tips = [
        "Try /health-check to verify backend latency.",
        "Open the Command Log to review your activity.",
        "Edit your profile to personalize the dashboard.",
        "Run /audit-log for a quick recap.",
      ];
      toast.message("AI Suggestion", { description: tips[Math.floor(Math.random() * tips.length)] });
      await logCommand(userId, "ai-suggest");
    },
  },
  {
    id: "sign-out",
    label: "Sign out",
    description: "End your session",
    group: "Core",
    run: async ({ userId }) => {
      await logCommand(userId, "sign-out");
      await supabase.auth.signOut();
    },
  },
];
