import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password — PATCH X" },
      {
        name: "description",
        content: "Set a new password for your PATCH X investigator account.",
      },
      { property: "og:title", content: "Reset Password — PATCH X" },
      { property: "og:description", content: "Set a new PATCH X account password." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="grid-lines flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass w-full max-w-[400px] rounded-xl p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="glow-ring flex size-10 items-center justify-center rounded-lg bg-primary/12">
            <KeyRound className="size-5 text-primary" />
          </div>
          <h1 className="font-display text-lg font-semibold">Set a new password</h1>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password" className="text-xs uppercase text-muted-foreground">
              New password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface/70"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
