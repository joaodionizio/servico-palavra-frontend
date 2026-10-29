import { expect, test, type Page, type Route } from "@playwright/test";

const usuario = {
  id: "00000000-0000-0000-0000-000000000001",
  nome: "Pessoa Teste",
  email: "teste@example.com",
  roles: []
};

const dashboard = {
  conteudosConcluidos: 0,
  favoritos: 0,
  possuiPlanoBiblicoAtivo: false,
  formacoesRecentes: [],
  favoritosRecentes: [],
  conteudosComProgresso: [],
  planoBiblicoAtivo: null,
  leituraHoje: null,
  estatisticas: {
    totalFavoritos: 0,
    totalConteudosConcluidos: 0,
    percentualPlanoBiblico: 0
  }
};

type ApiStats = {
  loginCalls: number;
  authMeCalls: number;
  logoutCalls: number;
};

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

async function mockApi(page: Page, authenticated = true) {
  const stats: ApiStats = {
    loginCalls: 0,
    authMeCalls: 0,
    logoutCalls: 0
  };

  await page.route("**/mock-api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path.endsWith("/api/auth/csrf")) {
      return json(route, { success: true, data: { token: "test-csrf-token" } });
    }

    if (path.endsWith("/api/auth/login") && request.method() === "POST") {
      stats.loginCalls += 1;
      return json(route, { success: true, data: { usuario } });
    }

    if (path.endsWith("/api/auth/me")) {
      stats.authMeCalls += 1;
      return authenticated
        ? json(route, { success: true, data: usuario })
        : json(route, { success: false, message: "Sessão expirada." }, 401);
    }

    if (path.endsWith("/api/dashboard/me")) {
      return json(route, { success: true, data: dashboard });
    }

    if (path.endsWith("/api/auth/logout")) {
      stats.logoutCalls += 1;
      return json(route, { success: true });
    }

    return json(route, { success: true, data: [] });
  });

  return stats;
}

async function signIn(page: Page) {
  const stats = await mockApi(page, true);
  await page.goto("/login");
  await page.getByPlaceholder("Seu email").fill("teste@example.com");
  await page.getByPlaceholder("Sua senha").fill("senha-teste");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/app(?:$|[/?#])/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: "Sua jornada de formação" })).toBeVisible();
  return stats;
}

test("login usa a resposta do POST sem GET /me redundante", async ({ page }) => {
  const stats = await signIn(page);
  expect(stats.loginCalls).toBe(1);
  expect(stats.authMeCalls).toBe(0);
});

test("logout navega assim que a requisicao real termina", async ({ page }) => {
  const stats = await signIn(page);
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/login(?:$|[/?#])/, { timeout: 5_000 });
  expect(stats.logoutCalls).toBe(1);
});

test("menu móvel abre e expõe a navegação principal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("link", { name: "Início", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Formações", exact: true })).toBeVisible();
});

test("rota protegida redireciona para login quando a sessão expira", async ({ page }) => {
  await mockApi(page, false);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login\?/, { timeout: 10_000 });
});

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
]) {
  test(`login sem overflow horizontal em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/login");
    await expect(page.getByPlaceholder("Seu email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow).toBe(false);
  });
}
