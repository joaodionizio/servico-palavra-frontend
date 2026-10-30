import { expect, test, type Page, type Route } from "@playwright/test";

const usuario = {
  id: "00000000-0000-0000-0000-000000000001",
  nome: "Pessoa Teste",
  email: "teste@example.com",
  roles: []
};

const planId = "11111111-1111-1111-1111-111111111111";

const dashboard = {
  conteudosConcluidos: 0,
  favoritos: 0,
  possuiPlanoBiblicoAtivo: true,
  formacoesRecentes: [],
  favoritosRecentes: [],
  conteudosComProgresso: [],
  planoBiblicoAtivo: {
    id: planId,
    nome: "Plano acessível",
    duracaoDias: 30,
    duracaoAnos: 0,
    duracaoMeses: 1,
    dataInicio: "2026-10-29",
    dataFimPrevista: "2026-11-27",
    diasConcluidos: 0,
    totalDias: 30,
    percentual: 0
  },
  leituraHoje: {
    id: "dia-1",
    diaNumero: 1,
    mesNumero: 1,
    dataPrevista: "2026-10-29",
    leiturasTexto: "Gênesis 1–3",
    concluido: false
  },
  estatisticas: {
    totalFavoritos: 0,
    totalConteudosConcluidos: 0,
    percentualPlanoBiblico: 0
  }
};

const planoAtivo = {
  id: planId,
  nome: "Plano acessível",
  duracaoDias: 30,
  duracaoAnos: 0,
  duracaoMeses: 1,
  dataInicio: "2026-10-29",
  dataFimPrevista: "2026-11-27",
  status: "Ativo"
};

const dias = [
  {
    id: "dia-1",
    diaNumero: 1,
    mesNumero: 1,
    dataPrevista: "2026-10-29",
    leiturasTexto: "Gênesis 1–3",
    concluido: false
  },
  {
    id: "dia-2",
    diaNumero: 2,
    mesNumero: 1,
    dataPrevista: "2026-10-30",
    leiturasTexto: "Gênesis 4–6",
    concluido: false
  }
];

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

async function mockApi(page: Page) {
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
      return json(route, { success: true, data: usuario });
    }

    if (path.endsWith("/api/dashboard/me")) {
      return json(route, { success: true, data: dashboard });
    }

    if (path.endsWith("/api/planos-biblicos/ativo")) {
      return json(route, { success: true, data: planoAtivo });
    }

    if (path.endsWith(`/api/planos-biblicos/${planId}/dias`)) {
      return json(route, { success: true, data: dias });
    }

    if (path.includes("/api/planos-biblicos/dias/") && request.method() === "POST") {
      return json(route, { success: true });
    }

    if (path.endsWith("/api/auth/logout")) {
      return json(route, { success: true });
    }

    return json(route, { success: true, data: [] });
  });
}

async function signIn(page: Page) {
  await mockApi(page);
  await page.goto("/login");
  await page.getByPlaceholder("Seu email").fill("teste@example.com");
  await page.getByPlaceholder("Sua senha").fill("senha-teste");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/app(?:$|[/?#])/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: "Sua jornada de formação" })).toBeVisible();
}

test("focus trap do drawer móvel contém teclado e restaura foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);

  const opener = page.locator('button[aria-controls="app-navigation-drawer"]');
  const drawer = page.locator("#app-navigation-drawer");
  const main = page.locator("#main-content");

  await opener.focus();
  await expect(opener).toBeFocused();
  await opener.press("Enter");

  await expect(opener).toHaveAccessibleName("Fechar menu");
  await expect(drawer).not.toHaveAttribute("aria-hidden", "true");
  await expect.poll(() => drawer.evaluate((element) => (element as HTMLElement).inert)).toBe(false);
  await expect.poll(() => main.evaluate((element) => (element as HTMLElement).inert)).toBe(true);

  const first = drawer.locator(".app-rail-nav a").first();
  const last = drawer.locator(".app-rail-actions button").last();
  await expect(first).toBeFocused();

  await last.focus();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();

  await first.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(opener).toHaveAccessibleName("Abrir menu");
  await expect(opener).toBeFocused();
  await expect.poll(() => main.evaluate((element) => (element as HTMLElement).inert)).toBe(false);
  await expect.poll(() => drawer.evaluate((element) => (element as HTMLElement).inert)).toBe(true);
  await expect(drawer).toHaveAttribute("aria-hidden", "true");
});

test("focus trap do diálogo mensal contém teclado, fecha por Escape e restaura foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  await page.goto("/app/cronograma");

  const monthButton = page.getByRole("button", { name: /Mês 1/i }).first();
  await monthButton.focus();
  await expect(monthButton).toBeFocused();
  await monthButton.press("Enter");

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toHaveAttribute("aria-labelledby", "month-schedule-title");

  const closeButton = dialog.getByRole("button", { name: "Fechar" });
  const lastButton = dialog.getByRole("button").last();
  await expect(closeButton).toBeFocused();

  await lastButton.focus();
  await page.keyboard.press("Tab");
  await expect(closeButton).toBeFocused();

  await closeButton.focus();
  await page.keyboard.press("Shift+Tab");
  await expect(lastButton).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(monthButton).toBeFocused();

  await monthButton.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Fechar" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(monthButton).toBeFocused();
});
