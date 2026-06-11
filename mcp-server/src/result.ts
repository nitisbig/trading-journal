type ToolResult = {
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

/** Success result: JSON-serialize the payload as text content. */
export function ok(data: unknown): ToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

/** Error result: a readable message flagged with isError (never throws to client). */
export function fail(message: string): ToolResult {
  return {
    content: [{ type: "text", text: message }],
    isError: true,
  };
}

/** Runs a tool handler, converting unexpected throws into a clean error result. */
export async function guard(fn: () => Promise<ToolResult>): Promise<ToolResult> {
  try {
    return await fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(`Unexpected error: ${message}`);
  }
}
