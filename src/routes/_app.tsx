import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Menu } from "lucide-react";
import { AppSidebar } from "@/components/patchx/AppSidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/" });
    return { user: data.user };
  },
  component: AppLayout,
});

function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[264px] shrink-0 lg:block">
        <div className="fixed top-0 bottom-0 w-[264px]">
          <AppSidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open navigation"
                className="rounded-md border border-border-strong/60 p-2 text-muted-foreground"
              >
                <Menu className="size-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[264px] p-0">
              <SheetTitle className="sr-only">PATCH X navigation</SheetTitle>
              <AppSidebar onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-display text-sm tracking-[0.14em]">PATCH X</span>
        </div>

        <main className="grid-lines min-w-0 flex-1 px-5 py-7 md:px-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
