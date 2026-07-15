# Incident Response Runbook

## 1. Preparation & Detection
- **Alert Channels:** PagerDuty / Slack `#alerts-production`
- **Dashboards:** Prometheus/Grafana or Datadog tracking 4xx/5xx error rates, response latencies, and worker queue depths.

## 2. Triage Phase
- **Is the API down?** 
  - Check `/v1/ready` endpoint. If it returns 503, the database connection is failing. 
  - Check Neon console for compute size or connection limits.
- **Are workers failing?** 
  - Check logs for `type: "alert"` and `severity: "high"`.
  - Common issues include Third-Party API timeouts (e.g., Payment Gateway, Email Provider).

## 3. Containment
- If under a DoS attack: Adjust rate limiting thresholds in `app.ts` or at the Cloudflare / Load Balancer level.
- If a critical bug is deploying: Rollback the Deno Deploy deployment instantly via the dashboard or CLI `deployctl deploy --prod <previous_commit>`.

## 4. Resolution
- **Outbox Event Failures:** Events in `failed` state can be manually requeued after resolving the underlying issue by resetting `state = 'pending'` and `retryCount = 0` via the DB console.
- **Third-Party Outage (Provider Down):** Notify customers via status page. Transactions are queued in Outbox to process asynchronously when the provider returns.

## 5. Post-Mortem
- Within 48 hours, document the Root Cause Analysis (RCA).
- Create tickets for preventative engineering tasks.
