import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Blocks,
  BrainCircuit,
  FileBarChart,
  Fingerprint,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  LogOut,
  Network,
  Settings,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { investigator } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cases", label: "Cases", icon: FolderKanban },
  { to: "/evidence", label: "Evidence", icon: Fingerprint },
  { to: "/ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { to: "/correlation", label: "Cross-Source Correlation", icon: Network },
  { to: "/contradictions", label: "Contradictions", icon: AlertTriangle },
  { to: "/external-records", label: "External Records", icon: Globe2 },
  { to: "/chain-of-custody", label: "Chain of Custody", icon: Workflow },
  { to: "/blockchain", label: "Blockchain Ledger", icon: Blocks },
  { to: "/verification", label: "Verification", icon: ShieldCheck },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, profile } = useProfile();

  const displayName = profile?.full_name ?? user?.email ?? investigator.name;
  const displayEmail = profile?.email ?? user?.email ?? investigator.role;
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Session ended securely");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="glow-ring flex size-9 items-center justify-center rounded-lg bg-primary/12">
          <Activity className="size-5 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-base font-semibold tracking-[0.14em] text-sidebar-foreground">
            PATCH X
          </div>
          <div className="text-[10px] tracking-wider text-muted-foreground uppercase">
            Evidence Intelligence
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-primary/10 text-primary border border-primary/25 hover:bg-primary/12 hover:text-primary",
            }}
            inactiveProps={{ className: "border border-transparent" }}
          >
            <item.icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </button>
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary">
            {initials || "IA"}
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[13px] font-medium text-sidebar-foreground">
              {displayName}
            </div>
            <div className="truncate text-[11px] text-muted-foreground">{displayEmail}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-primary">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              {investigator.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
