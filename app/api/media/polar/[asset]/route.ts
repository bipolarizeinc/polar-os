import type { NextRequest } from "next/server";

const APPROVED_MEDIA: Record<string, { id: string; type: string }> = {
  greeting: { id: "1qBuwnBQJpWVhlb1394DayjTd9pm5h3q5", type: "video/mp4" },
  products: { id: "131KWI-NUKZ8GyL3CnYBnK9iRIiQGs48K", type: "video/mp4" },
  blueprint: { id: "1oW5koVa4JgLs2gWUBl5UaNeMbv6op4Ki", type: "video/mp4" },
  drdocx: { id: "1jgn7UlAgMfy76YAx6Rtgq9VwgHTVfJv3", type: "video/mp4" },
  nexus: { id: "1x_SokIj2Skra12nnlrDwhQsadN-XnFJJ", type: "video/mp4" },
  about: { id: "1d3eDxkr2vlUC-NPcQCaABUM4y58px3Fz", type: "video/mp4" },
  intake: { id: "1rHWjd4H-uCI5BvBWrwvif1kG9hrnCs0U", type: "video/mp4" },
  idle: { id: "1dZFaIRQzY1bZfmx897KgW-rskMw4glSb", type: "video/mp4" },
  music: { id: "1KzM-3__wy6rjwptD6I9NSAkSWjMYkrjx", type: "audio/wav" },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ asset: string }> },
) {
  const { asset } = await context.params;
  const media = APPROVED_MEDIA[asset];

  if (!media) {
    return new Response("Approved media asset not found.", { status: 404 });
  }

  const source = new URL("https://drive.usercontent.google.com/download");
  source.searchParams.set("id", media.id);
  source.searchParams.set("export", "download");
  source.searchParams.set("confirm", "t");

  const headers = new Headers();
  const range = request.headers.get("range");
  if (range) headers.set("range", range);

  const upstream = await fetch(source, {
    headers,
    redirect: "follow",
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Approved media source is temporarily unavailable.", {
      status: upstream.status,
    });
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", upstream.headers.get("content-type") || media.type);
  responseHeaders.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  responseHeaders.set("Accept-Ranges", "bytes");

  for (const name of ["content-length", "content-range", "etag", "last-modified"]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
