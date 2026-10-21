import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw, BookOpen, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { readiness } from "@/lib/quiz";

export const Route = createFileRoute("/results/$sessionId")({
  head: () => ({
    meta: [
      { title: "Your Results — AZ-900 Vibe Quizzer" },
      { name: "description", content: "Your AZ-900 quiz score, readiness badge and topic breakdown." },
      { property: "og:title", content: "AZ-900 Quiz Results" },
      { property: "og:description", content: "Score, readiness and per-topic breakdown." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Results,
});

function Results() {
  const { sessionId } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["results", sessionId],
    queryFn: async () => {
      const [s, a] = await Promise.all([
        supabase.from("quiz_sessions").select("*").eq("id", sessionId).single(),
        supabase.from("user_answers").select("is_correct, questions(topic_id, topics(id, title))").eq("session_id", sessionId),
      ]);
      if (s.error) throw s.error;
      if (a.error) throw a.error;
      const byTopic: Record<string, { id: string; title: string; correct: number; total: number }> = {};
      for (const row of a.data) {
        const t = row.questions?.topics;
        if (!t) continue;
        const e = (byTopic[t.id] ??= { id: t.id, title: t.title, correct: 0, total: 0 });
        e.total++;
        if (row.is_correct) e.correct++;
      }
      return { session: s.data, topics: Object.values(byTopic) };
    },
  });

  if (isLoading || !data) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading results…</div>;
  const { session, topics } = data;
  const ready = readiness(session.score, session.total_questions);
  const pct = session.total_questions ? Math.round((session.score / session.total_questions) * 100) : 0;
  const weak = topics.filter((t) => t.correct / t.total < 0.7).map((t) => t.id);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-12">
      <div className="glass rounded-2xl p-8 text-center animate-in fade-in zoom-in-95 duration-500">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Final score</p>
        <h1 className="mt-2 text-6xl font-bold"><span className="text-brand">{session.score}/{session.total_questions}</span></h1>
        <p className="mt-1 text-muted-foreground">{pct}%</p>
        <span className={`mt-5 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${ready ? "bg-success text-success-foreground" : "bg-warm/20 text-warm"}`}>
          {ready ? "Exam Ready! 🚀" : "Needs Revision 📚"}
        </span>
      </div>

      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-semibold">Topic breakdown</h2>
        <div className="space-y-4">
          {topics.map((t) => {
            const p = Math.round((t.correct / t.total) * 100);
            return (
              <div key={t.id}>
                <div className="mb-1 flex justify-between text-sm"><span>{t.title}</span><span className="text-muted-foreground">{p}% ({t.correct}/{t.total})</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full ${p >= 70 ? "bg-success" : "bg-destructive"}`} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/quiz" search={{ topic: undefined }} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-primary-foreground shadow-glow">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Link>
        {weak.length > 0 && (
          <Link to="/quiz" search={{ topics: weak.join(",") }} className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 font-semibold">
            <BookOpen className="h-4 w-4" /> Review Weak Topics
          </Link>
        )}
        <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4" /> Dashboard
        </Link>
      </div>
    </main>
  );
}
