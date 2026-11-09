CREATE TABLE "github_repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"installation_id" uuid NOT NULL,
	"github_repo_id" bigint NOT NULL,
	"full_name" text NOT NULL,
	"is_private" boolean NOT NULL,
	"removed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_github_installations" (
	"user_id" uuid NOT NULL,
	"installation_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_github_installations_user_id_installation_id_pk" PRIMARY KEY("user_id","installation_id")
);
--> statement-breakpoint
ALTER TABLE "user_installations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_installations" CASCADE;--> statement-breakpoint
ALTER TABLE "installations" RENAME TO "github_installations";--> statement-breakpoint
ALTER TABLE "github_installations" DROP CONSTRAINT "installations_installation_id_unique";--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "github_installation_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "github_account_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "account_login" text NOT NULL;--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "account_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "repository_selection" text NOT NULL;--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "permissions" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "github_installations" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "github_repositories" ADD CONSTRAINT "github_repositories_installation_id_github_installations_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."github_installations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_github_installations" ADD CONSTRAINT "user_github_installations_installation_id_github_installations_id_fk" FOREIGN KEY ("installation_id") REFERENCES "public"."github_installations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "github_repos_installation_repo_uq" ON "github_repositories" USING btree ("installation_id","github_repo_id");--> statement-breakpoint
ALTER TABLE "github_installations" DROP COLUMN "installation_id";--> statement-breakpoint
ALTER TABLE "github_installations" DROP COLUMN "uninstalled_at";--> statement-breakpoint
ALTER TABLE "github_installations" ADD CONSTRAINT "github_installations_github_installation_id_unique" UNIQUE("github_installation_id");