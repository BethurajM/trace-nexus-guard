import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Activity, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In — PATCH X Evidence Intelligence Platform" },
      {
        name: "description",
        content:
          "Secure sign-in for authorized investigators to the PATCH X digital evidence intelligence and integrity platform.",
      },
      { property: "og:title", content: "Sign In — PATCH X" },
      {
        property: "og:description",
        content: "Authorized personnel access to the PATCH X digital forensics platform.",
      },
    ],
  }),
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.7 3-4.3 3-7.3 0-.7-.1-1.4-.2-2z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2.1 1-3.5 1a6.1 6.1 0 0 1-5.7-4.2l-3.3 2.6A10 10 0 0 0 12 22"
      />
      <path fill="#4A90E2" d="M22.5 12.4c0-.7-.1-1.4-.2-2H12v3.9h5.5a4.7 4.7 0 0 1-2 3.1l3.2 2.5c1.9-1.7 3-4.3 3-7.3" />
      <path
        fill="#FBBC05"
        d="M6.3 13.9a6 6 0 0 1 0-3.8L3 7.5a10 10 0 0 0 0 9zM12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3 7.5l3.3 2.6A6.1 6.1 0 0 1 12 5.9"
      />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/dashboard", replace: true });
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Credentials required for authorized access");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your investigator account");
          return;
        }
        toast.success("Account created — access granted");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Authenticated — welcome, Investigator");
      }
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      toast.success("Authenticated with Google");
      navigate({ to: "/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent to your email");
  };

  return (
    <div className="grid-lines flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="glow-ring mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-primary/12">
            <Activity className="size-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-[0.18em]">PATCH X</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Digital Evidence Intelligence & Integrity Platform
          </p>
        </div>

        <form onSubmit={submit} className="glass rounded-xl p-6">
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={signInWithGoogle}
              disabled={googleLoading}
            >
              <GoogleIcon />
              {googleLoading ? "Opening Google..." : "Continue with Google"}
            </Button>

            <div className="flex items-center gap-3 text-[10px] tracking-widest text-muted-foreground uppercase">
              <span className="h-px flex-1 bg-border" />
              or use credentials
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs tracking-wide text-muted-foreground uppercase">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface/70 pl-9"
                  autoComplete="username"
                  placeholder="investigator@agency.gov"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs tracking-wide text-muted-foreground uppercase">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-surface/70 pl-9"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Verifying credentials..."
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
              </button>
              <button
                type="button"
                onClick={resetPassword}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-warning/25 bg-warning/8 px-4 py-2.5 text-xs text-warning">
          <ShieldCheck className="size-4" />
          🔐 Authorized Personnel Only
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
          PATCH X is an investigator-assistance system. It reports potential matches and potential
          contradictions only, and never determines guilt or innocence.
        </p>
      </div>
    </div>
  );
}
