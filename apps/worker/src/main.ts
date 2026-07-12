/**
 * Worker Daemon Entrypoint
 * This is a standalone process for background jobs. It is not an HTTP server.
 */

let isRunning = true;
const POLLING_INTERVAL = 5000;

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

  while (isRunning) {
    // TODO: Implement actual job polling (e.g. queue system, cron jobs)
    log('INFO', 'Worker health check / polling...');

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
