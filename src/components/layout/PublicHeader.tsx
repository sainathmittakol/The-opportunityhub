import { Link } from "@tanstack/react-router";
import { Compass, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/explore", label: "Explore" },
  { to: "/internships", label: "Internships" },
  { to: "/jobs", label: "Jobs" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/courses", label: "Courses" },
  { to: "/help", label: "Help" },
];

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="OpportunityHub home">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Compass className="size-4.5" aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">OpportunityHub</span>
    </Link>
  );
}

export function PublicHeader() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Button key={n.to} asChild variant="ghost" size="sm">
              <Link to={n.to} activeProps={{ className: "text-primary" }}>
                {n.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/signup">Create profile</Link>
              </Button>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="px-4 pt-4">Menu</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col p-4">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-md px-3 py-2.5 text-sm hover:bg-muted">
                    {n.label}
                  </Link>
                ))}
                {!user ? (
                  <Link to="/login" className="rounded-md px-3 py-2.5 text-sm hover:bg-muted">
                    Sign in
                  </Link>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            A student career discovery platform: find opportunities, understand why they match you, and
            prepare properly before you apply.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Discover</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/explore" className="hover:text-foreground">Explore all</Link></li>
            <li><Link to="/internships" className="hover:text-foreground">Internships</Link></li>
            <li><Link to="/jobs" className="hover:text-foreground">Jobs</Link></li>
            <li><Link to="/hackathons" className="hover:text-foreground">Hackathons</Link></li>
            <li><Link to="/courses" className="hover:text-foreground">Courses</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Your account</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/signup" className="hover:text-foreground">Create free profile</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/resume" className="hover:text-foreground">Resume & ATS check</Link></li>
            <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        OpportunityHub — sample opportunity records are clearly marked as demo data.
      </div>
    </footer>
  );
}
