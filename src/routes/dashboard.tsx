import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ListOrdered, User as UserIcon, LogOut, Command } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function NavItem({ to, icon: Icon, label }: { to: string; icon: typeof Command; label: string }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function DashboardLayout() {
  const { user, loading, roles, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card/50 p-4 md:block">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg" style={{ background: "var(--gradient-primary)" }} />
          <span className="font-semibold tracking-tight">Kingdom</span>
        </Link>
        <nav className="space-y-1">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Overview" />
          <NavItem to="/dashboard/commands" icon={ListOrdered} label="Command Log" />
          <NavItem to="/dashboard/profile" icon={UserIcon} label="Profile" />
        </nav>
        <div className="mt-8 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          Press <kbd className="rounded border border-border bg-background px-1 font-mono">⌘K</kbd> for commands.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{user.email}</span>
            {roles.map((r) => (
              <Badge key={r} variant="secondary" className="text-[10px] uppercase">{r}</Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-1.5 h-4 w-4" />
            Sign out
          </Button>
        </header>
        <main className="min-w-0 flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
