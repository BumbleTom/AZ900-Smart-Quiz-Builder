import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Cloud, Layers, Shield, Zap, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchTopics, getUserId, readiness } from "@/lib/quiz";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AZ-900 Vibe Quizzer — Azure Fundamentals Practice" },
      { name: "description", content: "Practice AZ-900 Azure Fundamentals with instant feedback, explanations and African analogies." },
      { property: "og:title", content: "AZ-900 Vibe Quizzer" },
      { property: "og:description", content: "Unofficial AZ-900 study companion with instant feedback and African analogies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const icons: Record<string, typeof Cloud> = { cloud: Cloud, layers: Layers, shield: Shield };

function Dashboard() {
  const topics = useQuery({ queryKey: ["topics"], queryFn: fetchTopics });
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => setUid(getUserId()), []);
  const history = useQuery({
    queryKey: ["history", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quiz_sessions")
        .select("*")
        .eq("user_id", uid!)
        .not("completed_at", "is", null)
        .order("completed_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="mx-auto max-w-5xl px-5 pb-32 pt-12">
      <header className="mb-10">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">AZ-900 · Azure Fundamentals</span>
        <h1 className="mt-4 text-4xl font-bold md:text-6xl">
          <span className="text-brand">Vibe Quizzer</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Learn cloud concepts with instant feedback and analogies from everyday African life.
        </p>
        <Link
          to="/quiz"
          search={{ topic: undefined }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]"
        >
          <Zap className="h-5 w-5" /> Quick Start Quiz
        </Link>
      </header>

      <h2 className="mb-4 text-xl font-semibold">Pick a topic</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {topics.data?.map((t) => {
          const Icon = icons[t.icon_name] ?? Cloud;
          return (
            <Link
              key={t.id}
              to="/quiz"
              search={{ topic: t.id }}
              className="glass group rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="mb-4 inline-flex rounded-xl bg-brand p-3 text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
            </Link>
          );
        })}
        {topics.isLoading && [0, 1, 2].map((i) => <div key={i} className="glass h-40 animate-pulse rounded-2xl" />)}
      </div>

      <section className="glass mt-10 rounded-2xl p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <History className="h-5 w-5 text-accent" /> Recent scores
        </h2>
        {history.data?.length ? (
          <ul className="divide-y divide-border">
            {history.data.map((s) => {
              const ready = readiness(s.score, s.total_questions);
              return (
                <li key={s.id}>
                  <Link to="/results/$sessionId" params={{ sessionId: s.id }} className="flex items-center justify-between py-3 hover:text-accent">
                    <span className="text-sm text-muted-foreground">{new Date(s.completed_at!).toLocaleString()}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-semibold">{s.score}/{s.total_questions}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ready ? "bg-success text-success-foreground" : "bg-secondary text-warm"}`}>
                        {ready ? "Ready" : "Revise"}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No quizzes yet — take your first one above.</p>
        )}
      </section>
    </main>
  );
}
