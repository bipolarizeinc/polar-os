import "server-only";

export type PolarResearchSource = {
  url: string;
  title?: string;
};

export type PolarResearchResult = {
  query: string;
  answer: string;
  sources: PolarResearchSource[];
  responseId: string | null;
  searchedAt: string;
  model: string;
};

type ResponseAnnotation = {
  type?: string;
  url?: string;
  title?: string;
  url_citation?: {
    url?: string;
    title?: string;
  };
};

type ResponseContentItem = {
  type?: string;
  text?: string;
  annotations?: ResponseAnnotation[];
};

type ResponseOutputItem = {
  type?: string;
  content?: ResponseContentItem[];
  action?: {
    sources?: Array<{ url?: string; title?: string }>;
  };
};

type OpenAIResponse = {
  id?: string;
  output?: ResponseOutputItem[];
};

function normalizeUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function extractResearchPayload(response: OpenAIResponse) {
  const textParts: string[] = [];
  const sourceMap = new Map<string, PolarResearchSource>();

  for (const item of response.output ?? []) {
    for (const source of item.action?.sources ?? []) {
      const url = normalizeUrl(source.url);
      if (url) sourceMap.set(url, { url, title: source.title });
    }

    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) textParts.push(content.text);

      for (const annotation of content.annotations ?? []) {
        const citation = annotation.url_citation ?? annotation;
        const url = normalizeUrl(citation.url);
        if (url) sourceMap.set(url, { url, title: citation.title });
      }
    }
  }

  return {
    answer: textParts.join("\n").trim(),
    sources: [...sourceMap.values()],
  };
}

export async function researchWeb(
  query: string,
  options?: {
    model?: string;
    context?: string;
  },
): Promise<PolarResearchResult> {
  const cleanQuery = query.trim();
  if (!cleanQuery) throw new Error("POLAR web research requires a query.");
  if (cleanQuery.length > 4_000) throw new Error("POLAR web research query is too large.");

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("POLAR web research is not configured.");

  const model = options?.model ?? process.env.POLAR_RESEARCH_MODEL ?? "gpt-5.6";
  const searchedAt = new Date().toISOString();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        tools: [{ type: "web_search", search_context_size: "medium" }],
        include: ["web_search_call.action.sources"],
        input: [
          {
            role: "system",
            content:
              "You are P.O.L.A.R.'s research extension. Search the live web when needed. Separate confirmed facts from inference. Prefer primary and authoritative sources. Preserve dates. Never invent a citation or claim a source says something it does not say.",
          },
          {
            role: "user",
            content: options?.context
              ? `${cleanQuery}\n\nAUTHORIZED CONTEXT:\n${options.context}`
              : cleanQuery,
          },
        ],
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("POLAR web research request failed", { status: response.status });
      throw new Error(`POLAR web research failed (${response.status}).`);
    }

    const body = (await response.json()) as OpenAIResponse;
    const extracted = extractResearchPayload(body);

    if (!extracted.answer) {
      throw new Error("POLAR web research returned no usable answer.");
    }

    return {
      query: cleanQuery,
      answer: extracted.answer,
      sources: extracted.sources,
      responseId: body.id ?? null,
      searchedAt,
      model,
    };
  } finally {
    clearTimeout(timeout);
  }
}
