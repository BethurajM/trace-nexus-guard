import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/patchx/PageHeader";
import { Panel } from "@/components/patchx/Panel";
import { StatusBadge } from "@/components/patchx/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { investigator } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Workspace Settings — PATCH X" },
      {
        name: "description",
        content: "Investigator profile, access role, notification and integrity-monitoring preferences for PATCH X.",
      },
      { property: "og:title", content: "Workspace Settings — PATCH X" },
      { property: "og:description", content: "Profile, access and integrity preferences." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Investigator profile and workspace preferences."
        actions={<StatusBadge tone="primary">Authorized access</StatusBadge>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Investigator Profile">
          <div className="space-y-4">
            <Field label="Name" value={investigator.name} />
            <Field label="Role" value={investigator.role} />
            <Field label="Badge ID" value={investigator.badge} />
            <Field label="Unit" value={investigator.unit} />
            <Field label="Email" value={investigator.email} />
            <Button onClick={() => toast.success("Profile preferences saved")}>Save Changes</Button>
          </div>
        </Panel>

        <Panel title="Preferences">
          <div className="space-y-5">
            <Toggle
              id="alerts"
              label="Integrity alerts"
              hint="Notify when an evidence hash mismatch is detected."
            />
            <Toggle
              id="contradictions"
              label="Contradiction notifications"
              hint="Notify when new potential inconsistencies are flagged."
            />
            <Toggle
              id="ledger"
              label="Ledger confirmations"
              hint="Notify when an evidence event is recorded on the ledger."
            />
          </div>
        </Panel>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</Label>
      <Input defaultValue={value} className="mt-1.5 bg-surface/60" />
    </div>
  );
}

function Toggle({ id, label, hint }: { id: string; label: string; hint: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={id} className="text-sm">
          {label}
        </Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} defaultChecked />
    </div>
  );
}
