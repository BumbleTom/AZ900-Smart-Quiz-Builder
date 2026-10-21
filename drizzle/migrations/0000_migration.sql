CREATE TABLE public.topics (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, description text NOT NULL DEFAULT '', icon_name text NOT NULL DEFAULT 'cloud');
CREATE TABLE public.questions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE, question_text text NOT NULL, options jsonb NOT NULL, correct_index int NOT NULL, explanation text NOT NULL, african_analogy text NOT NULL);
CREATE TABLE public.quiz_sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, score int NOT NULL DEFAULT 0, total_questions int NOT NULL DEFAULT 0, completed_at timestamptz);
CREATE TABLE public.user_answers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE, question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE, selected_index int NOT NULL, is_correct boolean NOT NULL);
GRANT SELECT ON public.topics, public.questions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.quiz_sessions, public.user_answers TO anon, authenticated;
GRANT ALL ON public.topics, public.questions, public.quiz_sessions, public.user_answers TO service_role;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "read sessions" ON public.quiz_sessions FOR SELECT USING (true);
CREATE POLICY "create sessions" ON public.quiz_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "finish sessions" ON public.quiz_sessions FOR UPDATE USING (completed_at IS NULL) WITH CHECK (true);
CREATE POLICY "read answers" ON public.user_answers FOR SELECT USING (true);
CREATE POLICY "create answers" ON public.user_answers FOR INSERT WITH CHECK (true);

INSERT INTO public.topics (id, title, description, icon_name) VALUES
('11111111-1111-1111-1111-111111111111','Cloud Concepts','Cloud models, benefits and service types','cloud'),
('22222222-2222-2222-2222-222222222222','Azure Architecture','Regions, zones, compute, networking and storage','layers'),
('33333333-3333-3333-3333-333333333333','Security & Governance','Identity, policy, compliance and cost management','shield');

INSERT INTO public.questions (topic_id, question_text, options, correct_index, explanation, african_analogy) VALUES
('11111111-1111-1111-1111-111111111111','Which cloud benefit lets you pay only for the resources you actually use?','["Consumption-based model","Capital expenditure","Fixed licensing","Reserved hardware"]',0,'The consumption-based (pay-as-you-go) model means you are billed only for what you use, turning upfront CapEx into OpEx.','Like buying M-Pesa airtime bundles: you top up and pay for the data you use, instead of building your own cell tower.'),
('11111111-1111-1111-1111-111111111111','In which service model does the customer manage only applications and data, while the provider manages the OS and runtime?','["IaaS","PaaS","SaaS","On-premises"]',1,'PaaS gives you a managed platform: the provider handles OS, patching and runtime; you focus on your code and data.','Like renting a fully equipped stall at a local market: the owner provides the stand, roof and power; you bring your goods and sell.'),
('22222222-2222-2222-2222-222222222222','What is an Azure Availability Zone?','["A global edge cache","A physically separate datacenter group within a region","A billing boundary","A virtual network subnet"]',1,'Availability Zones are physically separate locations within one region, each with independent power, cooling and networking.','Like a village solar microgrid with panels on three separate hills: if clouds cover one hill, the others keep the lights on.'),
('22222222-2222-2222-2222-222222222222','Which Azure resource acts as a logical container for grouping related resources?','["Subscription","Management group","Resource group","Region"]',2,'A resource group holds related resources so you can deploy, manage and delete them together.','Like a chama keeping all its records, savings and receipts in one labelled box, so the group manages them together.'),
('33333333-3333-3333-3333-333333333333','Which service enforces rules such as "only allow VMs in specific regions"?','["Azure Policy","Microsoft Entra ID","Azure Monitor","Azure Advisor"]',0,'Azure Policy evaluates resources against rules and can deny or flag non-compliant deployments.','Like county by-laws for matatus: every vehicle must meet the rules before it is allowed on the route.'),
('33333333-3333-3333-3333-333333333333','What does Multi-Factor Authentication (MFA) require?','["A longer password","Two or more verification methods","A VPN connection","Admin approval"]',1,'MFA requires two or more factors: something you know, something you have, or something you are.','Like withdrawing at an M-Pesa agent: you need your PIN and your phone and your ID, not just one of them.');