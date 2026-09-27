import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { PublicPage } from "@/components/layout/PublicPage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/states";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — OpportunityHub" },
      { name: "description", content: "Guides on profiles, opportunities, applications, resumes, ATS and privacy." },
      { property: "og:title", content: "Help Center — OpportunityHub" },
      { property: "og:description", content: "Answers about profiles, applications, resumes and privacy." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["help-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("help_articles")
        .select("id,title,category,content")
        .eq("published", true)
        .order("category");
      if (error) throw error;
      return data ?? [];
    },
  });

  const all = query.data ?? [];
  const categories = Array.from(new Set(all.map((a) => a.category).filter(Boolean))) as string[];
  const term = q.trim().toLowerCase();
  const filtered = all.filter(
    (a) =>
      (!category || a.category === category) &&
      (!term || a.title.toLowerCase().includes(term) || (a.content ?? "").toLowerCase().includes(term)),
  );

  return (
    <PublicPage>
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Help Center</h1>
          <p className="text-muted-foreground">Search the guides or browse by category.</p>
        </header>

        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search help articles..."
            aria-label="Search help articles"
            className="h-11 pl-9"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Button size="sm" variant={category ? "outline" : "default"} onClick={() => setCategory(null)}>
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        {query.isLoading ? <RowSkeleton /> : null}
        {query.isError ? <ErrorState onRetry={() => query.refetch()} /> : null}
        {query.data && filtered.length === 0 ? (
          <EmptyState
            title="No articles match your search."
            description="Try a different word, or browse all categories."
            actionLabel="Clear search"
            onAction={() => {
              setQ("");
              setCategory(null);
            }}
          />
        ) : null}

        <Accordion type="single" collapsible className="panel divide-y divide-border px-5">
          {filtered.map((a) => (
            <AccordionItem key={a.id} value={a.id} className="border-0">
              <AccordionTrigger className="text-left">
                <span>
                  <span className="block font-medium">{a.title}</span>
                  <span className="block text-xs text-muted-foreground">{a.category}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-line text-sm text-muted-foreground">
                {a.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PublicPage>
  );
}
