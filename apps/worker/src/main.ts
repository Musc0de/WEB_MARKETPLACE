/**
 * Worker Daemon Entrypoint
 * This is a standalone process for background jobs. It is not an HTTP server.
 */

/// <reference lib="deno.ns" />
import { pollOutbox } from './outbox/poller.ts';
import { runCleanupJobs } from './jobs/cleanup.ts';
import { initializeHandlers } from './outbox/registry.ts';

let isRunning = true;
const POLLING_INTERVAL = 2000;
const CLEANUP_INTERVAL = 1000 * 60; // 1 minute

function log(level: 'INFO' | 'WARN' | 'ERROR', message: string, extra?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      level,
      timestamp: new Date().toISOString(),
      service: 'worker',
      message,
      ...extra,
    }),
  );
}

async function startWorker() {
  log('INFO', 'Worker started');

  // Initialize handlers for outbox events
  initializeHandlers();

  let lastCleanupTime = 0;

  while (isRunning) {
    try {
      // 1. Poll Outbox
      const processedCount = await pollOutbox();
      if (processedCount > 0) {
        log('INFO', `Processed ${processedCount} outbox events`);
      }

      // 2. Run Cleanup Jobs Periodically
      const now = Date.now();
      if (now - lastCleanupTime >= CLEANUP_INTERVAL) {
        log('INFO', 'Running periodic cleanup jobs...');
        await runCleanupJobs();
        lastCleanupTime = now;
      }
    } catch (err: any) {
      log('ERROR', 'Error during worker loop iteration', { error: err.message });
    }

    // Sleep for POLLING_INTERVAL without blocking the event loop
    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL));
  }

  log('INFO', 'Worker stopped cleanly');
}

// Graceful Shutdown Handlers
function handleShutdown(signal: string) {
  log('INFO', `Received ${signal}, shutting down gracefully...`);
  isRunning = false;
}

if (Deno.build.os !== 'windows') {
  Deno.addSignalListener('SIGTERM', () => handleShutdown('SIGTERM'));
  Deno.addSignalListener('SIGINT', () => handleShutdown('SIGINT'));
} else {
  // Windows polyfill for SIGINT
  Deno.addSignalListener('SIGINT', () => handleShutdown('SIGINT'));
  // SIGTERM is not fully supported natively on Windows Deno, but Deno tasks will kill it anyway.
}

// Start the daemon
if (import.meta.main) {
  startWorker().catch((err) => {
    log('ERROR', 'Fatal worker error', { error: err.message, stack: err.stack });
    Deno.exit(1);
  });
}

// Export for testing
export { handleShutdown, startWorker };
