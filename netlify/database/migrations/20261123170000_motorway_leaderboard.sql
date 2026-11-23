CREATE TABLE motorway_runs (
  id uuid PRIMARY KEY,
  player_hash text NOT NULL,
  rules_hash text NOT NULL,
  season integer NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  nickname varchar(20),
  score integer CHECK (score >= 0),
  ticks integer CHECK (ticks BETWEEN 1 AND 14000),
  attempts integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  hidden boolean NOT NULL DEFAULT false,
  CHECK ((finished_at IS NULL AND score IS NULL AND ticks IS NULL) OR
         (finished_at IS NOT NULL AND score IS NOT NULL AND ticks IS NOT NULL AND nickname IS NOT NULL))
);
CREATE INDEX motorway_runs_player_started ON motorway_runs (player_hash, started_at DESC);
CREATE INDEX motorway_runs_rankings ON motorway_runs (season, score DESC, ticks, finished_at) WHERE finished_at IS NOT NULL AND hidden = false;
