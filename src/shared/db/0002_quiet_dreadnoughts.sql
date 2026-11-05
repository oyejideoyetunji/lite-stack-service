ALTER TABLE "installation_attempts" RENAME TO "installation_states";--> statement-breakpoint
ALTER TABLE "installation_states" RENAME COLUMN "attempt_hash" TO "state_hash";--> statement-breakpoint
ALTER TABLE "installation_states" DROP CONSTRAINT "installation_attempts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "installation_states" ADD CONSTRAINT "installation_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;