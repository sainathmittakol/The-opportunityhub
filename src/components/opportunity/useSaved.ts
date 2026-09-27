import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export function useSavedIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-ids", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("opportunity_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.opportunity_id));
    },
  });
}

export function useToggleSave() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, saved }: { id: string; saved: boolean }) => {
      if (!user) throw new Error("auth");
      if (saved) {
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("user_id", user.id)
          .eq("opportunity_id", id);
        if (error) throw error;
        return false;
      }
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({ user_id: user.id, opportunity_id: id });
      if (error) throw error;
      return true;
    },
    onSuccess: (isSaved) => {
      qc.invalidateQueries({ queryKey: ["saved-ids"] });
      qc.invalidateQueries({ queryKey: ["saved-list"] });
      toast.success(isSaved ? "Saved to your list" : "Removed from saved");
    },
    onError: () => toast.error("We couldn't update your saved list. Please try again."),
  });
}
