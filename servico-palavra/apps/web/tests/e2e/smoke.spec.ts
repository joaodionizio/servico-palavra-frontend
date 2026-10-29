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

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

async function mockApi(page: Page, authenticated = true) {
  await page.route("**/mock-api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path.endsWith("/api/auth/csrf")) {
      return json(route, { success: true, data: { token: "test-csrf-token" } });
    }

    if (path.endsWith("/api/auth/login") && request.method() === "POST") {
      return json(route, { success: true, data: { usuario } });
    }

    if (path.endsWith("/api/auth/me")) {
      return authenticated
        ? json(route, { success: true, data: usuario })
        : json(route, { success: false, message: "Sessão expirada." }, 401);
    }

    if (path.endsWith("/api/dashboard/me")) {
      return json(route, { success: true, data: dashboard });
    }

    if (path.endsWith("/api/auth/logout")) {
      return json(route, { success: true });
    }

    return json(route, { success: true, data: [] });
  });
}

async function signIn(page: Page) {
  await mockApi(page, true);
  await page.goto("/login");
  await page.getByPlaceholder("Seu email").fill("teste@example.com");
  await page.getByPlaceholder("Sua senha").fill("senha-teste");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/app(?:$|[/?#])/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Sua jornada de formação" })).toBeVisible();
}

test("login autenticado chega ao dashboard com API mockada", async ({ page }) => {
  await signIn(page);
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
