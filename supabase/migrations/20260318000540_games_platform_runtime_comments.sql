comment on table public.realtime_signals is
  'Public-safe realtime invalidation layer. Carries only lightweight signals, not feed or leaderboard business data.';

comment on table public.request_rate_limits is
  'Fixed-window request limiter state for public mutation routes.';

comment on view public.leaderboard_global_view is
  'Canonical global leaderboard read model.';

comment on view public.leaderboard_game_view is
  'Canonical per-game leaderboard read model.';

comment on view public.live_feed_view is
  'Canonical projector/live feed read model.';

comment on view public.leaderboard_view is
  'Compatibility alias for legacy global leaderboard consumers. Prefer leaderboard_global_view in new code.';
