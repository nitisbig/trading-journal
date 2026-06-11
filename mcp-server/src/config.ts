import { z } from "zod";

const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  TRADING_JOURNAL_EMAIL: z.string().email(),
  TRADING_JOURNAL_PASSWORD: z.string().min(1),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
    .join("\n");
  // stderr only — stdout is reserved for the MCP protocol stream.
  console.error(
    `[trading-journal-mcp] Invalid or missing configuration:\n${details}\n\n` +
      `Set SUPABASE_URL, SUPABASE_ANON_KEY, TRADING_JOURNAL_EMAIL and ` +
      `TRADING_JOURNAL_PASSWORD in your MCP server "env" config.`,
  );
  process.exit(1);
}

export const config = {
  supabaseUrl: parsed.data.SUPABASE_URL,
  supabaseAnonKey: parsed.data.SUPABASE_ANON_KEY,
  email: parsed.data.TRADING_JOURNAL_EMAIL,
  password: parsed.data.TRADING_JOURNAL_PASSWORD,
} as const;
