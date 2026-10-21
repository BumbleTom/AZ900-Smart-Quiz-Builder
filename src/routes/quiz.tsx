import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Lightbulb, Globe2, ArrowRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchQuestions, fetchTopics, getUserId, shuffle, type Question, type Topic } from "@/lib/quiz";

type Search = { topic?: string | undefined; topics?: string | undefined };

export const Route = createFileRoute("/quiz")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    topic: typeof s["topic"] === "string" ? s["topic"] : undefined,
    topics: typeof s["topics"] === "string" ? s["topics"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Quiz — AZ-900 Vibe Quizzer" },
      { name: "description", content: "Answer AZ-900 practice questions with instant feedback." },
      { property: "og:title", content: "AZ-900 Practice Quiz" },
      { property: "og:description", content: "Interactive AZ-900 questions with explanations and African analogies." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { topic, topics: topicList } = Route.useSearch();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [topicMap, setTopicMap] = useState<Record<string, Topic>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ids = topic ? [topic] : topicList ? topicList.split(",") : undefined;
        const [qs, ts] = await Promise.all([fetchQuestions(ids), fetchTopics()]);
        const picked = shuffle(qs).slice(0, 5);
        setTopicMap(Object.fromEntries(ts.map((t) => [t.id, t])));
        const { data, error } = await supabase
          .from("quiz_sessions")
          .insert({ user_id: getUserId(), total_questions: picked.length })
          .select("id")
          .single();
        if (error) throw error;
        setSessionId(data.id);
        setQuestions(picked);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load quiz");
      }
    })();
  }, [topic, topicList]);

  if (error) return <Center>{error}</Center>;
  if (!questions || !sessionId) return <Center>Loading questions…</Center>;
  if (questions.length === 0) return <Center>No questions found for this topic.</Center>;

  const q = questions[idx]!;
  const answered = selected !== null;
  const progress = ((idx + (answered ? 1 : 0)) / questions.length) * 100;

  async function choose(i: number) {
    if (answered) return;
    setSelected(i);
    const correct = i === q.correct_index;
    if (correct) setScore((s) => s + 1);
    await supabase.from("user_answers").insert({ session_id: sessionId!, question_id: q.id, selected_index: i, is_correct: correct });
  }

  async function next() {
    if (idx + 1 < questions!.length) {
      setIdx(idx + 1);
      setSelected(null);
      return;
    }
    await supabase.from("quiz_sessions").update({ score, completed_at: new Date().toISOString() }).eq("id", sessionId!);
    navigate({ to: "/results/$sessionId", params: { sessionId: sessionId! } });
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <Home className="h-4 w-4" /> Dashboard
        </Link>
        <span className="text-sm text-muted-foreground">Question {idx + 1} of {questions.length}</span>
      </div>
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div key={q.id} className="glass animate-in fade-in slide-in-from-bottom-4 rounded-2xl p-6 duration-500 md:p-8">
        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-accent">
          {topicMap[q.topic_id]?.title ?? "AZ-900"}
        </span>
        <h1 className="mt-4 text-xl font-semibold leading-snug md:text-2xl">{q.question_text}</h1>

        <div className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct_index;
            const isPicked = i === selected;
            let cls = "border-border bg-secondary/40 hover:border-primary hover:bg-secondary";
            if (answered && isCorrect) cls = "border-success bg-success/15";
            else if (answered && isPicked) cls = "border-destructive bg-destructive/15";
            else if (answered) cls = "border-border bg-secondary/20 opacity-60";
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => choose(i)}
                className={`flex items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition ${cls}`}
              >
                <span><span className="mr-3 font-semibold text-muted-foreground">{String.fromCharCode(65 + i)}</span>{opt}</span>
                {answered && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                {answered && isPicked && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-xl border border-border bg-secondary/50 p-4">
              <p className={`mb-1 flex items-center gap-2 font-semibold ${selected === q.correct_index ? "text-success" : "text-destructive"}`}>
                <Lightbulb className="h-4 w-4" /> {selected === q.correct_index ? "Correct!" : "Not quite"}
              </p>
              <p className="text-sm text-muted-foreground">{q.explanation}</p>
            </div>
            <div className="rounded-xl border border-warm/40 bg-warm/10 p-4">
              <p className="mb-1 flex items-center gap-2 font-semibold text-warm"><Globe2 className="h-4 w-4" /> African Analogy</p>
              <p className="text-sm">{q.african_analogy}</p>
            </div>
            <button onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03]">
              {idx + 1 < questions.length ? "Next Question" : "See Results"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Center({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">{children}</div>;
}
