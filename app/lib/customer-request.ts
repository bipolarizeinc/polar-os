export async function customerRequest(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, { ...init, signal: AbortSignal.timeout(20_000) });
  } catch {
    throw new Error("The connection was interrupted. Your last saved progress is safe. Please try again.");
  }
}
