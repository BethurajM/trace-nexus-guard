import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Activity, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("investigator.a@patchx.gov.in");
  const [password, setPassword] = useState("demo-access");
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Credentials required for authorized access");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Authenticated — welcome, Investigator A");
      navigate({ to: "/dashboard" });
    }, 800);
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
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs tracking-wide text-muted-foreground uppercase">
                Email / Username
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface/70 pl-9"
                  autoComplete="username"
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
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying credentials..." : "Sign In"}
            </Button>

            <button
              type="button"
              onClick={() => toast.info("Password reset request sent to the security administrator")}
              className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Forgot Password
            </button>
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
