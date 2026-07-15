export const recordMetric = (
  name: string,
  value: number,
  tags: Record<string, string> = {},
) => {
  // In production, this would send metrics to Datadog, Prometheus, or CloudWatch
  // For now, we emit a structured log that can be parsed by our logging pipeline
  console.log(JSON.stringify({
    type: 'metric',
    name,
    value,
    tags,
    timestamp: new Date().toISOString(),
  }));
};

export const alertOnFailure = (
  jobName: string,
  error: Error | string,
  severity: 'low' | 'medium' | 'high' = 'medium',
) => {
  console.error(JSON.stringify({
    type: 'alert',
    jobName,
    severity,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  }));
};
