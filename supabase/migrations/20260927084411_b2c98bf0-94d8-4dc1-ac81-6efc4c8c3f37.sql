
DROP POLICY "help public read" ON public.help_articles;
CREATE POLICY "help public read" ON public.help_articles FOR SELECT USING (published = true);
