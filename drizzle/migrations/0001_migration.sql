-- Server computes correctness; answers only into unfinished sessions; one answer per question per session
CREATE OR REPLACE FUNCTION public.set_answer_correctness()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  SELECT (q.correct_index = NEW.selected_index) INTO NEW.is_correct FROM public.questions q WHERE q.id = NEW.question_id;
  IF NEW.is_correct IS NULL THEN RAISE EXCEPTION 'Unknown question'; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_answer_correctness BEFORE INSERT ON public.user_answers FOR EACH ROW EXECUTE FUNCTION public.set_answer_correctness();
ALTER TABLE public.user_answers ADD CONSTRAINT user_answers_one_per_q UNIQUE (session_id, question_id);
ALTER TABLE public.user_answers ADD CONSTRAINT user_answers_index_range CHECK (selected_index BETWEEN 0 AND 3);

DROP POLICY "create answers" ON public.user_answers;
CREATE POLICY "create answers" ON public.user_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.quiz_sessions s WHERE s.id = session_id AND s.completed_at IS NULL));

-- Sessions: start empty; score on finish is computed from recorded answers
DROP POLICY "create sessions" ON public.quiz_sessions;
CREATE POLICY "create sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (
  score = 0 AND completed_at IS NULL AND total_questions BETWEEN 1 AND 50);

CREATE OR REPLACE FUNCTION public.finalize_session()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.user_id := OLD.user_id;
  NEW.total_questions := OLD.total_questions;
  SELECT count(*) FILTER (WHERE is_correct) INTO NEW.score FROM public.user_answers WHERE session_id = OLD.id;
  IF NEW.completed_at IS NOT NULL THEN NEW.completed_at := now(); END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_finalize_session BEFORE UPDATE ON public.quiz_sessions FOR EACH ROW EXECUTE FUNCTION public.finalize_session();
REVOKE EXECUTE ON FUNCTION public.finalize_session() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_answer_correctness() FROM PUBLIC, anon, authenticated;