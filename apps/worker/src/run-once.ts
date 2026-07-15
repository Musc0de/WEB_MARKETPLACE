import { pollOutbox } from './outbox/poller.ts';
import { runCleanupJobs } from './jobs/cleanup.ts';
import { initializeHandlers } from './outbox/registry.ts';

async function main() {
  console.log('INFO', 'Running worker:once');
  initializeHandlers();

  const processedCount = await pollOutbox();
  console.log('INFO', `Processed ${processedCount} outbox events`);

  console.log('INFO', 'Running cleanup jobs');
  await runCleanupJobs();

  console.log('INFO', 'worker:once completed successfully.');
}

if (import.meta.main) {
  main().then(() => Deno.exit(0)).catch((err) => {
    console.error('Fatal error in worker:once', err);
    Deno.exit(1);
  });
}
