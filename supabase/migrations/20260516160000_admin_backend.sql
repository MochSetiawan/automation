-- Admin backend schema + policies

-- Profiles extensions
alter table public.profiles add column if not exists plan text;
alter table public.profiles add column if not exists expires_at timestamptz;
alter table public.profiles add column if not exists usage integer default 0;

alter table public.profiles alter column plan set default 'pro';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_plan_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_plan_check
      CHECK (plan IN ('pro', 'business'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.plan_channel_limit(p_plan text)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_plan = 'business' THEN
    RETURN 10;
  END IF;
  RETURN 5;
END $$;

CREATE OR REPLACE FUNCTION public.apply_plan_channel_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.plan IS NOT NULL THEN
    NEW.channel_limit := plan_channel_limit(NEW.plan);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_apply_plan_channel_limit ON public.profiles;
CREATE TRIGGER trg_apply_plan_channel_limit
  BEFORE INSERT OR UPDATE OF plan ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.apply_plan_channel_limit();

CREATE OR REPLACE FUNCTION public.is_member_expired(p_user uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.profiles
    WHERE id = p_user
      AND expires_at IS NOT NULL
      AND expires_at < now()
  );
$$;

CREATE OR REPLACE FUNCTION public.can_create_channel(uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  limit_count integer;
  current_count integer;
  expired boolean;
BEGIN
  SELECT channel_limit, (expires_at IS NOT NULL AND expires_at < now())
  INTO limit_count, expired
  FROM public.profiles
  WHERE id = uid;

  IF expired THEN
    RETURN false;
  END IF;

  IF limit_count IS NULL THEN
    RETURN true;
  END IF;

  SELECT count(*) INTO current_count
  FROM public.channels
  WHERE user_id = uid;

  RETURN current_count < limit_count;
END $$;

CREATE OR REPLACE FUNCTION public.increment_usage_on_channel()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET usage = COALESCE(usage, 0) + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_increment_usage_on_channel ON public.channels;
CREATE TRIGGER trg_increment_usage_on_channel
  AFTER INSERT ON public.channels
  FOR EACH ROW EXECUTE FUNCTION public.increment_usage_on_channel();

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'channels'
      AND policyname = 'channels_insert_if_can_create'
  ) THEN
    CREATE POLICY "channels_insert_if_can_create"
      ON public.channels
      FOR INSERT
      WITH CHECK (public.can_create_channel(auth.uid()));
  END IF;
END $$;

-- Upload logs
CREATE TABLE IF NOT EXISTS public.upload_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_title text NOT NULL,
  video_url text,
  channel_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.upload_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.profiles
    WHERE id = uid AND role = 'admin'
  );
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'upload_logs'
      AND policyname = 'upload_logs_insert_owner'
  ) THEN
    CREATE POLICY "upload_logs_insert_owner"
      ON public.upload_logs
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'upload_logs'
      AND policyname = 'upload_logs_select_owner'
  ) THEN
    CREATE POLICY "upload_logs_select_owner"
      ON public.upload_logs
      FOR SELECT
      USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
  END IF;
END $$;

-- Admin audit logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id uuid,
  action text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_audit_logs'
      AND policyname = 'admin_audit_logs_select_admin'
  ) THEN
    CREATE POLICY "admin_audit_logs_select_admin"
      ON public.admin_audit_logs
      FOR SELECT
      USING (public.is_admin(auth.uid()));
  END IF;
END $$;
