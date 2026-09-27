import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicPage } from "@/components/layout/PublicPage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your student profile — OpportunityHub" },
      {
        name: "description",
        content: "Create a free student profile to get matched with internships, jobs, hackathons and courses.",
      },
      { property: "og:title", content: "Create your student profile — OpportunityHub" },
      { property: "og:description", content: "Get matched with opportunities that fit your skills and goals." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/onboarding", replace: true });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Use a password of at least 8 characters.");
    setBusy(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName.trim() } },
    });
    setBusy(false);
    if (err) {
      setError(
        err.message.toLowerCase().includes("already")
          ? "An account with this email already exists. Try signing in instead."
          : "We couldn't create your account right now. Please try again.",
      );
      return;
    }
    if (!data.session) {
      setCheckEmail(true);
      return;
    }
    toast.success("Your account is ready.");
    navigate({ to: "/onboarding" });
  }

  return (
    <PublicPage>
      <div className="mx-auto max-w-md py-8">
        <div className="panel p-7">
          {checkEmail ? (
            <div className="space-y-3 text-center">
              <h1 className="font-display text-2xl font-semibold">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>. Click it to
                activate your account, then sign in.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Go to sign in</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-semibold">Create your student profile</h1>
              <p className="mt-1 text-sm text-muted-foreground">Free, and takes a few minutes to set up.</p>
              <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                </div>
                {error ? (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account..." : "Create profile"}
                </Button>
              </form>
              <p className="mt-5 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PublicPage>
  );
}
