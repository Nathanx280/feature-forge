import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ListOrdered, NotebookPen, BarChart3, Bot, Command } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function NavItem({ to, icon: Icon, label }: { to: string; icon: typeof Command; label: string }) {
  const location = useLocation();
  const active = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
        active
          ? "bg-primary/10 text-primary shadow-[inset_2px_0_0_0_var(--primary)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card/30 p-4 backdrop-blur md:block">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-lg shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          />
          <span className="font-semibold tracking-tight">
            Kingdom <span className="text-primary text-xs">v2000</span>
          </span>
        </Link>
        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/dashboard/notes" icon={NotebookPen} label="Notes" />
          <NavItem to="/dashboard/analytics" icon={BarChart3} label="Analytics" />
          <NavItem to="/dashboard/assistant" icon={Bot} label="AI Assistant" />
          <NavItem to="/dashboard/commands" icon={ListOrdered} label="Command Log" />
        </nav>
        <div className="mt-8 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          Press <kbd className="rounded border border-border bg-background px-1 font-mono">⌘K</kbd> for commands.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Public workspace</span>
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          </div>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to landing
          </Link>
        </header>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
