export interface DeferredTask {
  label: string;
  run: () => Promise<void>;
}

/**
 * Run all deferred tasks with Promise.allSettled so one failure
 * does not block others. Failures are logged with task label.
 */
export async function runDeferredTasks(tasks: DeferredTask[]): Promise<void> {
  const results = await Promise.allSettled(tasks.map((t) => t.run()));

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const task = tasks[i];
    if (result?.status === "rejected") {
      console.error(`[deferred] task "${task?.label}" failed:`, result.reason);
    }
  }
}
