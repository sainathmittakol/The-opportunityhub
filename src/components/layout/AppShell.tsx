import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BookmarkIcon,
  Compass,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Send,
  Shield,
  Target,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "./PublicHeader";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const MAIN = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/saved", label: "Saved", icon: BookmarkIcon },
  { to: "/applications", label: "Applications", icon: Send },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/skill-gap", label: "Skill Gap", icon: Target },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/help", label: "Help", icon: HelpCircle },
];

const BOTTOM = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/saved", label: "Saved", icon: BookmarkIcon },
  { to: "/applications", label: "Applied", icon: Send },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: unread = 0 } = useQuery({
    queryKey: ["unread-count", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("read", false);
      if (error) throw error;
      return count ?? 0;
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex">
        <div className="px-2 text-sidebar-foreground [&_span]:text-sidebar-foreground">
          <Logo />
        </div>
        <nav aria-label="Sections" className="mt-6 flex-1 space-y-1 overflow-y-auto">
          {MAIN.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent font-medium text-sidebar-accent-foreground" }}
            >
              <item.icon className="size-4.5" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
              {item.to === "/notifications" && unread > 0 ? (
                <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-xs font-semibold text-sidebar-primary-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent font-medium" }}
            >
              <Shield className="size-4.5" aria-hidden="true" />
              Admin
            </Link>
          ) : null}
        </nav>
        <Button
          variant="ghost"
          className="justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={signOut}
        >
          <LogOut className="mr-3 size-4.5" aria-hidden="true" /> Sign out
        </Button>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" aria-label="Notifications">
            <Link to="/notifications" className="relative">
              <Bell className="size-5" aria-hidden="true" />
              {unread > 0 ? (
                <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
              ) : null}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <main className="px-4 pt-6 pb-28 sm:px-6 lg:ml-64 lg:pb-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur lg:hidden"
      >
        {BOTTOM.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-[11px] text-muted-foreground",
            )}
            activeProps={{ className: "text-primary font-medium" }}
          >
            <item.icon className="size-5" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
