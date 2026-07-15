ALTER TABLE "sss_security_audit_logs" DROP CONSTRAINT "sss_security_audit_logs_user_id_sss_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sss_security_audit_logs" ADD CONSTRAINT "sss_security_audit_logs_user_id_sss_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sss_users"("id") ON DELETE cascade ON UPDATE no action;