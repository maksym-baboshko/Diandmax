interface LogPayload {
  scope: string;
  event: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

interface ErrorLogPayload extends LogPayload {
  error?: unknown;
}

export function logServerInfo(payload: LogPayload): void {
  console.log(JSON.stringify({ level: "info", ...payload }));
}

export function logServerError(payload: ErrorLogPayload): void {
  const { error, ...rest } = payload;
  const errorDetails =
    error instanceof Error
      ? { message: error.message, stack: error.stack, name: error.name }
      : { raw: String(error) };

  console.error(JSON.stringify({ level: "error", ...rest, error: errorDetails }));
}
