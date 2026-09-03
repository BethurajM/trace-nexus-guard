import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface InvestigatorProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<InvestigatorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      setUser(data.user ?? null);
      if (data.user) {
        const { data: row } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .eq("id", data.user.id)
          .maybeSingle();
        if (active) setProfile(row ?? null);
      } else {
        setProfile(null);
      }
      if (active) setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return { user, profile, loading };
}
