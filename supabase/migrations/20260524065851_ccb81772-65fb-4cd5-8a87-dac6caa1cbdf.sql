ALTER TABLE public.evaluations ADD COLUMN IF NOT EXISTS session_id text NOT NULL DEFAULT '';
ALTER TABLE public.nodes ADD COLUMN IF NOT EXISTS session_id text NOT NULL DEFAULT '';
ALTER TABLE public.edges ADD COLUMN IF NOT EXISTS session_id text NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS evaluations_session_idx ON public.evaluations(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS nodes_session_idx ON public.nodes(session_id, type, value);
CREATE INDEX IF NOT EXISTS edges_session_idx ON public.edges(session_id);
-- Drop old unique constraints if any, then add session-scoped uniqueness
DO $$ BEGIN
  ALTER TABLE public.nodes DROP CONSTRAINT IF EXISTS nodes_type_value_key;
EXCEPTION WHEN others THEN NULL; END $$;
CREATE UNIQUE INDEX IF NOT EXISTS nodes_session_type_value_uniq ON public.nodes(session_id, type, value);
DO $$ BEGIN
  ALTER TABLE public.edges DROP CONSTRAINT IF EXISTS edges_source_id_target_id_kind_key;
EXCEPTION WHEN others THEN NULL; END $$;
CREATE UNIQUE INDEX IF NOT EXISTS edges_session_src_tgt_kind_uniq ON public.edges(session_id, source_id, target_id, kind);