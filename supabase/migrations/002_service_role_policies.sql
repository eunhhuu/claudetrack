-- Allow service role to insert sessions (for API ingest endpoint)
create policy "Service role can insert sessions"
  on sessions for insert
  with check (true);

-- Allow service role to manage projects (for auto-creating projects via ingest)
create policy "Service role can insert projects"
  on projects for insert
  with check (true);

create policy "Service role can read projects"
  on projects for select
  using (true);
