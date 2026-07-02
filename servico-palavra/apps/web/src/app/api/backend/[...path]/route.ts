import { NextRequest, NextResponse } from "next/server";

// Kept server-only so the browser never needs to know the Render URL in production.
const backendOrigin = (process.env.API_BACKEND_URL ?? "https://servico-palavra-api.onrender.com").replace(/\/+$/, "");

const hopByHopHeaders = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade"
]);

// fetch may transparently decompress the upstream body, so these values can no
// longer describe the body written by Next.js.
const responseHeadersToRecalculate = new Set(["content-encoding", "content-length"]);

function getSetCookies(headers: Headers) {
  const headersWithGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  const cookies = headersWithGetSetCookie.getSetCookie?.();

  if (cookies) {
    return cookies;
  }

  const setCookie = headers.get("set-cookie");
  return setCookie ? [setCookie] : [];
}

function getForwardedHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);

  for (const header of hopByHopHeaders) {
    headers.delete(header);
  }

  return headers;
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const backendPath = path.map(encodeURIComponent).join("/");
  const target = new URL(path[0] === "health" ? `/${backendPath}` : `/api/${backendPath}`, backendOrigin);
  target.search = request.nextUrl.search;
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer();

  let upstream: Response;

  try {
    upstream = await fetch(target, {
      method: request.method,
      headers: getForwardedHeaders(request),
      body,
      cache: "no-store",
      redirect: "manual"
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "A API esta temporariamente indisponivel. Aguarde alguns instantes e tente novamente."
      },
      { status: 503 }
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey !== "set-cookie" &&
      !hopByHopHeaders.has(normalizedKey) &&
      !responseHeadersToRecalculate.has(normalizedKey)
    ) {
      responseHeaders.set(key, value);
    }
  });

  // Append each value separately: combining Set-Cookie headers breaks cookies with Expires.
  for (const cookie of getSetCookies(upstream.headers)) {
    responseHeaders.append("Set-Cookie", cookie);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
