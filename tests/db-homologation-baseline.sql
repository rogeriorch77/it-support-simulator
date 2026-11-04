-- Disposable PostgreSQL test fixture. NO Supabase connection. Fake accounts only.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth;
GRANT USAGE ON SCHEMA auth TO authenticated, anon;
GRANT USAGE ON SCHEMA public TO authenticated, anon;
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
CREATE TABLE auth.users (
 id uuid PRIMARY KEY,
 raw_user_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 github_username text NOT NULL DEFAULT '',
 github_avatar text NOT NULL DEFAULT '',
 total_xp integer NOT NULL DEFAULT 0,
 quizzes_played integer NOT NULL DEFAULT 0,
 total_correct integer NOT NULL DEFAULT 0,
 total_answered integer NOT NULL DEFAULT 0,
 best_score integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_own_insert ON public.profiles
 FOR INSERT TO PUBLIC WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_own_update ON public.profiles
 FOR UPDATE TO PUBLIC USING (auth.uid() = id);
CREATE POLICY profiles_public_read ON public.profiles
 FOR SELECT TO anon,authenticated USING (true);
GRANT SELECT,TRUNCATE,TRIGGER,REFERENCES ON public.profiles TO anon;
GRANT SELECT,UPDATE,TRUNCATE,TRIGGER,REFERENCES ON public.profiles TO authenticated;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, github_username, github_avatar)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'user_name',''),
                   coalesce(new.raw_user_meta_data->>'avatar_url',''))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$function$;
CREATE TRIGGER on_auth_user_created
 AFTER INSERT ON auth.users FOR EACH ROW
 EXECUTE FUNCTION public.handle_new_user();
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'pg_catalog'
AS $function$
DECLARE cmd record;
BEGIN
  FOR cmd IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE','CREATE TABLE AS','SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
    IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') THEN
      EXECUTE format('alter table if exists %s enable row level security',cmd.object_identity);
    END IF;
  END LOOP;
END;
$function$;
GRANT EXECUTE ON FUNCTION public.rls_auto_enable()
TO PUBLIC,anon,authenticated,service_role;
CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
 WHEN TAG IN ('CREATE TABLE','CREATE TABLE AS','SELECT INTO')
 EXECUTE FUNCTION public.rls_auto_enable();
INSERT INTO auth.users(id,raw_user_meta_data)
VALUES
 ('11111111-1111-4111-8111-111111111111','{"user_name":"Student One"}'),
 ('22222222-2222-4222-8222-222222222222','{"user_name":"Student Two"}');
UPDATE public.profiles SET total_xp=150, quizzes_played=3, best_score=87
WHERE id='11111111-1111-4111-8111-111111111111';
UPDATE public.profiles SET total_xp=320, quizzes_played=8, best_score=95
WHERE id='22222222-2222-4222-8222-222222222222';
