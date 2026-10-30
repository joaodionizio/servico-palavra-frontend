const rawBaseUrl = process.env.PRODUCTION_BASE_URL?.trim();

if (!rawBaseUrl) {
  console.error("[smoke] Defina PRODUCTION_BASE_URL com a origem publicada, por exemplo https://seu-app.vercel.app");
  process.exit(2);
}

const baseUrl = rawBaseUrl.replace(/\/+$/, "");
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`✗ ${message}`);
}

function pass(message) {
  console.log(`✓ ${message}`);
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    redirect: "manual",
    cache: "no-store",
    ...options
  });

  return { url, response };
}

async function checkPage(path, label) {
  try {
    const { response } = await request(path);

    if (response.status !== 200) {
      fail(`${label}: esperado HTTP 200, recebido ${response.status}`);
      return;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      fail(`${label}: Content-Type inesperado (${contentType || "ausente"})`);
      return;
    }

    pass(`${label}: HTTP 200`);
  } catch (error) {
    fail(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function checkSecurityHeaders() {
  try {
    const { response } = await request("/login");
    const required = [
      "content-security-policy",
      "x-content-type-options",
      "referrer-policy",
      "x-frame-options"
    ];

    for (const header of required) {
      if (!response.headers.get(header)) {
        fail(`header de segurança ausente em /login: ${header}`);
      } else {
        pass(`header de segurança presente: ${header}`);
      }
    }
  } catch (error) {
    fail(`headers de segurança: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function checkBackendHealth() {
  try {
    const { response } = await request("/api/backend/health");

    if (!response.ok) {
      fail(`proxy/health: esperado 2xx, recebido ${response.status}`);
      return;
    }

    const serverTiming = response.headers.get("server-timing");
    if (!serverTiming?.includes("app;dur=")) {
      fail("proxy/health: header Server-Timing do backend não chegou ao frontend");
      return;
    }

    pass(`proxy/health: HTTP ${response.status} + Server-Timing`);
  } catch (error) {
    fail(`proxy/health: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function checkCsrf() {
  try {
    const { response } = await request("/api/backend/auth/csrf");

    if (!response.ok) {
      fail(`CSRF: esperado 2xx, recebido ${response.status}`);
      return;
    }

    let payload;
    try {
      payload = await response.json();
    } catch {
      fail("CSRF: resposta não é JSON válido");
      return;
    }

    const token = payload?.data?.token ?? payload?.token;
    if (typeof token !== "string" || token.length < 8) {
      fail("CSRF: token ausente ou inválido");
      return;
    }

    const setCookie = response.headers.get("set-cookie") ?? "";
    if (!setCookie.toLowerCase().includes("servicopalavra-csrf")) {
      fail("CSRF: cookie esperado não foi encaminhado pelo proxy");
      return;
    }

    pass("CSRF: token e cookie encaminhados pelo proxy same-origin");
  } catch (error) {
    fail(`CSRF: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(`[smoke] Validando ${baseUrl}`);

await checkPage("/login", "login");
await checkPage("/esqueci-senha", "recuperação de senha");
await checkSecurityHeaders();
await checkBackendHealth();
await checkCsrf();

if (failures.length > 0) {
  console.error(`\n[smoke] FALHOU: ${failures.length} verificação(ões) não passaram.`);
  process.exit(1);
}

console.log("\n[smoke] PASSOU: frontend, proxy, backend health, CSRF e headers básicos estão respondendo.");
