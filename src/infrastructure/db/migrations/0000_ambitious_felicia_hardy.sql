CREATE TABLE "game_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"player_id" uuid,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"xp_delta" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_uk" text NOT NULL,
	"name_en" text NOT NULL,
	"vocative_uk" text NOT NULL,
	"vocative_en" text NOT NULL,
	"form_name" text,
	"seats" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leaderboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"nickname" text NOT NULL,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leaderboard_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" text NOT NULL,
	"supabase_anon_uid" text,
	"guest_slug" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_supabase_anon_uid_unique" UNIQUE("supabase_anon_uid")
);
--> statement-breakpoint
CREATE TABLE "rsvp_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_slug" text,
	"guest_names" text[] NOT NULL,
	"attending" text NOT NULL,
	"guests_count" integer DEFAULT 1 NOT NULL,
	"dietary" text,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard" ADD CONSTRAINT "leaderboard_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_guest_slug_guests_slug_fk" FOREIGN KEY ("guest_slug") REFERENCES "public"."guests"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rsvp_responses" ADD CONSTRAINT "rsvp_responses_guest_slug_guests_slug_fk" FOREIGN KEY ("guest_slug") REFERENCES "public"."guests"("slug") ON DELETE no action ON UPDATE no action;