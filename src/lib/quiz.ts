import { supabase } from "@/integrations/supabase/client";

export type Topic = { id: string; title: string; description: string; icon_name: string };
export type Question = {
  id: string;
  topic_id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanation: string;
  african_analogy: string;
};

export function getUserId(): string {
  const k = "az900-user-id";
  let id = localStorage.getItem(k);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(k, id);
  }
  return id;
}

export const READY_THRESHOLD = 0.7;
export const readiness = (score: number, total: number) =>
  total > 0 && score / total >= READY_THRESHOLD;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T; a[i] = a[j] as T; a[j] = tmp;
  }
  return a;
}

export async function fetchTopics(): Promise<Topic[]> {
  const { data, error } = await supabase.from("topics").select("*").order("title");
  if (error) throw error;
  return data;
}

export async function fetchQuestions(topicIds?: string[]): Promise<Question[]> {
  let q = supabase.from("questions").select("*");
  if (topicIds?.length) q = q.in("topic_id", topicIds);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r) => ({ ...r, options: r.options as string[] }));
}
