
CREATE TYPE public.app_role AS ENUM ('student','admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'student',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  bio text,
  profile_image text,
  career_goal text,
  experience_level text,
  preferred_types text[] NOT NULL DEFAULT '{}',
  preferred_locations text[] NOT NULL DEFAULT '{}',
  preferred_work_modes text[] NOT NULL DEFAULT '{}',
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  degree text,
  field_of_study text,
  college text,
  university text,
  graduation_year int,
  percentage numeric,
  cgpa numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education TO authenticated;
GRANT ALL ON public.education TO service_role;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own education" ON public.education FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_education_updated BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills admin write" ON public.skills FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.interests TO anon, authenticated;
GRANT ALL ON public.interests TO service_role;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interests public read" ON public.interests FOR SELECT USING (true);

CREATE TABLE public.profile_skills (
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_level text DEFAULT 'intermediate',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, skill_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_skills TO authenticated;
GRANT ALL ON public.profile_skills TO service_role;
ALTER TABLE public.profile_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile skills" ON public.profile_skills FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.profile_interests (
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id uuid NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, interest_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_interests TO authenticated;
GRANT ALL ON public.profile_interests TO service_role;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile interests" ON public.profile_interests FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text,
  description text,
  website text,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.companies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies public read" ON public.companies FOR SELECT USING (true);
CREATE POLICY "companies admin write" ON public.companies FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_companies_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  description text,
  responsibilities text,
  eligibility text,
  opportunity_type text NOT NULL,
  location text,
  work_mode text,
  experience_level text,
  salary_min numeric,
  salary_max numeric,
  stipend text,
  deadline timestamptz,
  event_date timestamptz,
  external_url text,
  source_name text,
  source_url text,
  status text NOT NULL DEFAULT 'active',
  verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  verified_by uuid,
  last_checked_at timestamptz,
  organizer text,
  theme text,
  prize text,
  team_size text,
  provider text,
  difficulty text,
  duration text,
  price text,
  is_free boolean,
  certificate boolean,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunities public read" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "opportunities admin write" ON public.opportunities FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_opportunities_updated BEFORE UPDATE ON public.opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_opp_type ON public.opportunities(opportunity_type);
CREATE INDEX idx_opp_status ON public.opportunities(status);
CREATE INDEX idx_opp_deadline ON public.opportunities(deadline);
CREATE INDEX idx_opp_location ON public.opportunities(location);

CREATE TABLE public.opportunity_skills (
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  required boolean NOT NULL DEFAULT true,
  PRIMARY KEY (opportunity_id, skill_id)
);
GRANT SELECT ON public.opportunity_skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.opportunity_skills TO authenticated;
GRANT ALL ON public.opportunity_skills TO service_role;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opp skills public read" ON public.opportunity_skills FOR SELECT USING (true);
CREATE POLICY "opp skills admin write" ON public.opportunity_skills FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.saved_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_opportunities TO authenticated;
GRANT ALL ON public.saved_opportunities TO service_role;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own saved" ON public.saved_opportunities FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_saved_user ON public.saved_opportunities(user_id);

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Applied',
  applied_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own applications" ON public.applications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_app_user ON public.applications(user_id);
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  file_type text,
  extracted_text text,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own resumes" ON public.resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_resumes_updated BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.resume_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id uuid NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  overall_score int,
  keyword_score int,
  skills_score int,
  experience_score int,
  projects_score int,
  formatting_score int,
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  detected_skills text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_analysis TO authenticated;
GRANT ALL ON public.resume_analysis TO service_role;
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own resume analysis" ON public.resume_analysis FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.help_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.help_articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.help_articles TO authenticated;
GRANT ALL ON public.help_articles TO service_role;
ALTER TABLE public.help_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "help public read" ON public.help_articles FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "help admin write" ON public.help_articles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_help_updated BEFORE UPDATE ON public.help_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.career_goal_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_goal text NOT NULL,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  importance int NOT NULL DEFAULT 1,
  UNIQUE (career_goal, skill_id)
);
GRANT SELECT ON public.career_goal_skills TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.career_goal_skills TO authenticated;
GRANT ALL ON public.career_goal_skills TO service_role;
ALTER TABLE public.career_goal_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cgs public read" ON public.career_goal_skills FOR SELECT USING (true);
CREATE POLICY "cgs admin write" ON public.career_goal_skills FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "own resume files read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own resume files insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own resume files update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "own resume files delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

INSERT INTO public.skills (name, category) VALUES
('Python','Programming'),('Java','Programming'),('JavaScript','Programming'),('TypeScript','Programming'),
('React','Frontend'),('Node.js','Backend'),('SQL','Data'),('Excel','Data'),('Power BI','Data'),
('Tableau','Data'),('Statistics','Data'),('Data Analytics','Data'),('Machine Learning','AI'),
('Deep Learning','AI'),('NLP','AI'),('AWS','Cloud'),('Azure','Cloud'),('Docker','DevOps'),
('Kubernetes','DevOps'),('Cybersecurity','Security'),('Networking','Security'),('Figma','Design'),
('UI/UX','Design'),('Product Management','Product'),('Digital Marketing','Marketing'),('Git','Tools'),
('C++','Programming'),('Pandas','Data');

INSERT INTO public.interests (name) VALUES
('Software Development'),('Data Analytics'),('AI/ML'),('Cybersecurity'),('Cloud'),('UI/UX'),('Product'),('Digital Marketing');

INSERT INTO public.companies (name, description, website, location) VALUES
('Northwind Labs (Demo)', 'Demo product engineering company used for sample data.', 'https://example.com', 'Bengaluru'),
('Bluepeak Analytics (Demo)', 'Demo analytics consultancy used for sample data.', 'https://example.com', 'Pune'),
('Cirrus Cloudworks (Demo)', 'Demo cloud infrastructure company used for sample data.', 'https://example.com', 'Hyderabad'),
('Vertex Fintech (Demo)', 'Demo fintech company used for sample data.', 'https://example.com', 'Mumbai'),
('OpenCampus Learning (Demo)', 'Demo online learning provider used for sample data.', 'https://example.com', 'Remote'),
('Ignite Student Council (Demo)', 'Demo student community organising hackathons.', 'https://example.com', 'Remote');

INSERT INTO public.help_articles (title, category, content) VALUES
('Getting started with OpportunityHub','Getting Started','Create a free account, complete the 6-step onboarding, and you will immediately see personalised recommendations on your dashboard. Browsing opportunities does not require an account.'),
('How do I save an opportunity?','Opportunities','Open any opportunity card and press the bookmark icon, or press Save Opportunity on the details page. Saved items appear on the Saved page. You must be signed in to save.'),
('How does the match score work?','Opportunities','Your match score is rule-based and transparent. Skills count 40%, interests 25%, experience level 15%, location 10% and career goal 10%. Every opportunity page explains which parts of your profile matched.'),
('How do I upload my resume?','Resume','Go to the Resume page, choose a PDF or DOCX file under 5 MB and upload it. Your file is stored privately and only you can access it.'),
('What does ATS compatibility mean?','ATS','An applicant tracking system parses resumes before a human reads them. Our estimated compatibility analysis checks structure, keywords, skills, experience and projects. Different systems parse differently, so treat the score as guidance, not a guarantee.'),
('How do I track an application?','Applications','After you press Apply Now we ask whether you applied. Choose Yes, track application and it appears in your Application Tracker, where you can change the status at any time.'),
('Updating your profile','Profile','Open the Profile page to edit personal information, education, skills, interests, career goal and preferences. A higher completion percentage produces better recommendations.'),
('Managing notifications','Notifications','Notifications tell you about closing deadlines, new matches and profile reminders. Open the Notifications page to mark them as read.'),
('Account and password','Account','Use Forgot password on the sign-in page to receive a reset link. You can sign out from the sidebar or profile menu at any time.'),
('Your data and privacy','Privacy & Security','Your resume, phone number, applications and analyses are private to your account and protected by database-level access rules. Public browsing never exposes personal data.'),
('Something is not loading','Technical Issues','Refresh the page first. If a section still fails, sign out and back in. Most issues are temporary network errors and the page offers a retry action.');

INSERT INTO public.opportunities (title, company_id, description, responsibilities, eligibility, opportunity_type, location, work_mode, experience_level, salary_min, salary_max, stipend, deadline, external_url, source_name, source_url, verified, verified_at, organizer, theme, prize, team_size, event_date, provider, difficulty, duration, price, is_free, certificate)
SELECT * FROM (VALUES
('Data Analyst Intern (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Bluepeak%'), 'Work with the analytics team on dashboards and reporting for demo client projects.', 'Build dashboards, clean datasets, present weekly insights.', 'Students in final year of any quantitative degree.', 'internship','Pune','Hybrid','Fresher', NULL::numeric, NULL::numeric, 'INR 20,000 / month', now() + interval '9 days', 'https://example.com/apply','Demo Source','https://example.com', true, now(), NULL::text,NULL::text,NULL::text,NULL::text,NULL::timestamptz,NULL::text,NULL::text,NULL::text,NULL::text,NULL::boolean,NULL::boolean),
('Junior Python Developer (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Northwind%'), 'Build backend services in Python for internal demo products.', 'Write APIs, tests and documentation.', '0-1 years experience, strong Python fundamentals.', 'job','Bengaluru','On-site','0-1 years', 500000, 800000, NULL, now() + interval '20 days','https://example.com/apply','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Frontend Engineer - React (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Vertex%'), 'Own customer-facing React interfaces for a demo fintech dashboard.', 'Ship UI features, improve accessibility and performance.', '1-3 years React experience.', 'job','Mumbai','Hybrid','1-3 years', 900000, 1400000, NULL, now() + interval '25 days','https://example.com/apply','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Cloud Support Intern (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Cirrus%'), 'Support cloud infrastructure operations and learn AWS fundamentals.', 'Monitor environments, write runbooks.', 'Students interested in cloud computing.', 'internship','Hyderabad','Remote','Fresher', NULL, NULL, 'INR 15,000 / month', now() + interval '5 days','https://example.com/apply','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Machine Learning Intern (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Northwind%'), 'Assist with model experimentation on demo datasets.', 'Prepare datasets, run experiments, document results.', 'Familiarity with Python and basic ML.', 'internship','Remote','Remote','Fresher', NULL, NULL, 'INR 25,000 / month', now() + interval '2 days','https://example.com/apply','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Cybersecurity Analyst (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Vertex%'), 'Monitor and respond to security events in a demo environment.', 'Triage alerts, maintain security documentation.', '0-1 years, security fundamentals.', 'job','Pune','On-site','0-1 years', 600000, 900000, NULL, now() + interval '30 days','https://example.com/apply','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Freelance UI Designer (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'OpenCampus%'), 'Design screens for a demo learning product on a project basis.', 'Deliver Figma screens and a small design system.', 'Portfolio required.', 'freelance','Remote','Remote','0-1 years', NULL, NULL, 'INR 30,000 / project', now() + interval '14 days','https://example.com/apply','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Freelance Data Visualisation Project (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Bluepeak%'), 'Build a Power BI report pack for a demo client.', 'Model data and deliver three dashboards.', 'Power BI or Tableau experience.', 'freelance','Remote','Remote','1-3 years', NULL, NULL, 'INR 45,000 / project', now() + interval '11 days','https://example.com/apply','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('National AI Hackathon (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Ignite%'), 'A 36-hour demo hackathon focused on applied AI for education.', NULL, 'Open to all students.', 'hackathon','Remote','Remote','Fresher', NULL, NULL, NULL, now() + interval '7 days','https://example.com/register','Demo Source','https://example.com', true, now(), 'Ignite Student Council (Demo)','Applied AI for Education','INR 1,00,000 prize pool','2-4 members', now() + interval '21 days', NULL,NULL,NULL,NULL,NULL,NULL),
('Campus Data Sprint (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Ignite%'), 'Weekend data analysis challenge using open demo datasets.', NULL, 'Undergraduate students.', 'hackathon','Bengaluru','On-site','Fresher', NULL, NULL, NULL, now() + interval '12 days','https://example.com/register','Demo Source','https://example.com', false, NULL, 'Ignite Student Council (Demo)','Open Data','INR 50,000 prize pool','1-3 members', now() + interval '26 days', NULL,NULL,NULL,NULL,NULL,NULL),
('Cloud Build Challenge (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Cirrus%'), 'Build and deploy a cloud-native demo application in 48 hours.', NULL, 'Students and recent graduates.', 'hackathon','Hyderabad','Hybrid','0-1 years', NULL, NULL, NULL, now() + interval '18 days','https://example.com/register','Demo Source','https://example.com', true, now(), 'Cirrus Cloudworks (Demo)','Cloud Native','Cloud credits + mentorship','2-5 members', now() + interval '33 days', NULL,NULL,NULL,NULL,NULL,NULL),
('National Case Competition (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Vertex%'), 'Business case competition on demo fintech scenarios.', NULL, 'All disciplines.', 'competition','Mumbai','On-site','Fresher', NULL, NULL, NULL, now() + interval '16 days','https://example.com/register','Demo Source','https://example.com', false, NULL, 'Vertex Fintech (Demo)','Financial Inclusion','INR 75,000 prize pool','3-4 members', now() + interval '30 days', NULL,NULL,NULL,NULL,NULL,NULL),
('Python for Data Analysis (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'OpenCampus%'), 'Beginner-friendly course covering Python, Pandas and analysis workflows.', NULL, 'No prerequisites.', 'course','Remote','Remote','Fresher', NULL, NULL, NULL, NULL,'https://example.com/course','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,'OpenCampus Learning (Demo)','Beginner','6 weeks','Free', true, true),
('SQL Essentials (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'OpenCampus%'), 'Learn querying, joins and analytical SQL with practice datasets.', NULL, 'No prerequisites.', 'course','Remote','Remote','Fresher', NULL, NULL, NULL, NULL,'https://example.com/course','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,'OpenCampus Learning (Demo)','Beginner','4 weeks','Free', true, false),
('Power BI for Analysts (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'OpenCampus%'), 'Build interactive dashboards and data models in Power BI.', NULL, 'Basic Excel knowledge.', 'course','Remote','Remote','0-1 years', NULL, NULL, NULL, NULL,'https://example.com/course','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,'OpenCampus Learning (Demo)','Intermediate','5 weeks','INR 2,499', false, true),
('Applied Machine Learning (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'OpenCampus%'), 'Supervised learning, evaluation and deployment basics.', NULL, 'Python and statistics basics.', 'course','Remote','Remote','1-3 years', NULL, NULL, NULL, NULL,'https://example.com/course','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,'OpenCampus Learning (Demo)','Advanced','10 weeks','INR 6,999', false, true),
('Cloud Practitioner Certification Prep (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Cirrus%'), 'Prepare for an entry-level cloud certification with labs.', NULL, 'Open to all.', 'certification','Remote','Remote','Fresher', NULL, NULL, NULL, now() + interval '45 days','https://example.com/cert','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,'Cirrus Cloudworks (Demo)','Beginner','8 weeks','INR 3,999', false, true),
('Cybersecurity Fundamentals Certification (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Vertex%'), 'Certification track covering networks, threats and defence basics.', NULL, 'Open to all.', 'certification','Remote','Remote','Fresher', NULL, NULL, NULL, now() + interval '38 days','https://example.com/cert','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,'Vertex Fintech (Demo)','Intermediate','7 weeks','Free', true, true),
('Business Analyst Trainee (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Bluepeak%'), 'Entry-level analyst role working on demo reporting engagements.', 'Gather requirements, build reports.', 'Fresh graduates.', 'job','Remote','Remote','Fresher', 400000, 600000, NULL, now() + interval '1 day','https://example.com/apply','Demo Source','https://example.com', true, now(), NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('DevOps Intern (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'Cirrus%'), 'Learn CI/CD, containers and infrastructure automation.', 'Maintain pipelines and container images.', 'Students with Linux basics.', 'internship','Bengaluru','Hybrid','Fresher', NULL, NULL, 'INR 18,000 / month', now() + interval '28 days','https://example.com/apply','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),
('Expired Marketing Internship (Demo)', (SELECT id FROM public.companies WHERE name LIKE 'OpenCampus%'), 'Historical demo record used to show expired opportunities.', 'Run campaigns.', 'Students.', 'internship','Mumbai','On-site','Fresher', NULL, NULL, 'INR 10,000 / month', now() - interval '6 days','https://example.com/apply','Demo Source','https://example.com', false, NULL, NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)
) AS t;

UPDATE public.opportunities SET status = 'expired' WHERE deadline IS NOT NULL AND deadline < now();

INSERT INTO public.opportunity_skills (opportunity_id, skill_id, required)
SELECT o.id, s.id, true FROM public.opportunities o JOIN public.skills s ON (
  (o.title LIKE 'Data Analyst Intern%' AND s.name IN ('Python','SQL','Excel','Data Analytics')) OR
  (o.title LIKE 'Junior Python Developer%' AND s.name IN ('Python','SQL','Git')) OR
  (o.title LIKE 'Frontend Engineer%' AND s.name IN ('React','JavaScript','TypeScript')) OR
  (o.title LIKE 'Cloud Support Intern%' AND s.name IN ('AWS','Networking')) OR
  (o.title LIKE 'Machine Learning Intern%' AND s.name IN ('Python','Machine Learning','Pandas')) OR
  (o.title LIKE 'Cybersecurity Analyst%' AND s.name IN ('Cybersecurity','Networking')) OR
  (o.title LIKE 'Freelance UI Designer%' AND s.name IN ('Figma','UI/UX')) OR
  (o.title LIKE 'Freelance Data Visualisation%' AND s.name IN ('Power BI','SQL','Tableau')) OR
  (o.title LIKE 'National AI Hackathon%' AND s.name IN ('Python','Machine Learning')) OR
  (o.title LIKE 'Campus Data Sprint%' AND s.name IN ('Python','Data Analytics','SQL')) OR
  (o.title LIKE 'Cloud Build Challenge%' AND s.name IN ('AWS','Docker','Kubernetes')) OR
  (o.title LIKE 'National Case Competition%' AND s.name IN ('Excel','Product Management')) OR
  (o.title LIKE 'Python for Data Analysis%' AND s.name IN ('Python','Pandas','Data Analytics')) OR
  (o.title LIKE 'SQL Essentials%' AND s.name IN ('SQL')) OR
  (o.title LIKE 'Power BI for Analysts%' AND s.name IN ('Power BI','Excel')) OR
  (o.title LIKE 'Applied Machine Learning%' AND s.name IN ('Machine Learning','Python','Statistics')) OR
  (o.title LIKE 'Cloud Practitioner%' AND s.name IN ('AWS','Azure')) OR
  (o.title LIKE 'Cybersecurity Fundamentals%' AND s.name IN ('Cybersecurity','Networking')) OR
  (o.title LIKE 'Business Analyst Trainee%' AND s.name IN ('Excel','SQL','Data Analytics')) OR
  (o.title LIKE 'DevOps Intern%' AND s.name IN ('Docker','AWS','Git'))
) ON CONFLICT DO NOTHING;

INSERT INTO public.career_goal_skills (career_goal, skill_id, importance)
SELECT g.goal, s.id, 1 FROM public.skills s
JOIN (VALUES
 ('Become a Data Analyst', ARRAY['Excel','SQL','Python','Power BI','Statistics','Tableau','Data Analytics']),
 ('Become a Software Developer', ARRAY['JavaScript','TypeScript','React','Git','SQL','Node.js']),
 ('Learn AI/ML', ARRAY['Python','Machine Learning','Statistics','Deep Learning','Pandas']),
 ('Get my first job', ARRAY['Git','SQL','Excel','JavaScript']),
 ('Find an internship', ARRAY['Python','Git','Excel']),
 ('Build portfolio', ARRAY['React','Git','Figma']),
 ('Prepare for placements', ARRAY['C++','SQL','Java']),
 ('Freelance', ARRAY['Figma','UI/UX','React','Digital Marketing'])
) AS g(goal, names) ON s.name = ANY(g.names)
ON CONFLICT DO NOTHING;
