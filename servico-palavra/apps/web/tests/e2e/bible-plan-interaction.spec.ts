import { expect, test, type Page, type Route } from "@playwright/test";

const usuario = {
  id: "00000000-0000-0000-0000-000000000001",
  nome: "Pessoa Teste",
  email: "teste@example.com",
  roles: []
};

const planId = "11111111-1111-1111-1111-111111111111";

const planoAtivo = {
  id: planId,
  nome: "Plano adaptativo",
  duracaoDias: 365,
  duracaoAnos: 1,
  duracaoMeses: 0,
  dataInicio: "2026-10-29",
  dataFimPrevista: "2027-10-28",
  status: "Ativo"
};

const initialDays = [
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

const reconciledDays = [
  {
    ...initialDays[0],
    concluido: true
  },
  {
    ...initialDays[1],
    dataPrevista: "2026-11-03"
  }
];

const dashboard = {
  conteudosConcluidos: 0,
  favoritos: 0,
  possuiPlanoBiblicoAtivo: true,
  formacoesRecentes: [],
  favoritosRecentes: [],
  conteudosComProgresso: [],
  planoBiblicoAtivo: {
    id: planId,
    nome: "Plano adaptativo",
    duracaoDias: 365,
    duracaoAnos: 1,
    duracaoMeses: 0,
    dataInicio: "2026-10-29",
    dataFimPrevista: "2027-10-28",
    diasConcluidos: 0,
    totalDias: 365,
    percentual: 0
  },
  leituraHoje: initialDays[0],
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

type MockOptions = {
  mutationFails?: boolean;
  mutationDelayMs?: number;
};

async function mockApi(page: Page, options: MockOptions = {}) {
  let scheduleGets = 0;
  let mutationCompleted = false;

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
      scheduleGets += 1;
      return json(route, { success: true, data: mutationCompleted ? reconciledDays : initialDays });
    }

    if (path.endsWith("/api/planos-biblicos/dias/dia-1/concluir") && request.method() === "POST") {
      if (options.mutationDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, options.mutationDelayMs));
      }

      if (options.mutationFails) {
        return json(route, { success: false, message: "Falha simulada ao concluir a leitura." }, 500);
      }

      mutationCompleted = true;
      return json(route, { success: true });
    }

    if (path.endsWith("/api/auth/logout")) {
      return json(route, { success: true });
    }

    return json(route, { success: true, data: [] });
  });

  return {
    getScheduleGets: () => scheduleGets
  };
}

async function signIn(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("Seu email").fill("teste@example.com");
  await page.getByPlaceholder("Sua senha").fill("senha-teste");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/app(?:$|[/?#])/, { timeout: 10_000 });
  await expect(page.getByRole("heading", { name: "Sua jornada de formação" })).toBeVisible();
}

function getDayOneScheduleButton(page: Page) {
  return page.locator(".schedule-row").filter({ hasText: "Dia 1" }).getByRole("button");
}

test("concluir leitura reconcilia datas adaptativas sem reload e mostra feedback", async ({ page }) => {
  const api = await mockApi(page, { mutationDelayMs: 350 });
  await signIn(page);
  await page.goto("/app/plano-biblico");

  await expect(page.getByText("2026-10-30", { exact: true })).toBeVisible();

  const scheduleButton = getDayOneScheduleButton(page);
  await scheduleButton.click();

  await expect(scheduleButton).toHaveAttribute("aria-busy", "true");
  await expect(scheduleButton).toBeDisabled();
  await expect(scheduleButton).toContainText("Salvando");

  const successNotice = page.locator('.status-notice[role="status"]');
  await expect(successNotice).toContainText("Leitura concluída. O cronograma foi ajustado com as novas datas.");
  await expect(page.getByText("2026-11-03", { exact: true })).toBeVisible();
  await expect(page.getByText("2026-10-30", { exact: true })).toHaveCount(0);
  expect(api.getScheduleGets()).toBeGreaterThanOrEqual(2);
});

test("falha ao concluir leitura restaura estado anterior e anuncia erro", async ({ page }) => {
  await mockApi(page, { mutationFails: true });
  await signIn(page);
  await page.goto("/app/plano-biblico");

  const scheduleButton = getDayOneScheduleButton(page);
  await scheduleButton.click();

  const errorNotice = page.locator('.status-notice[role="alert"]');
  await expect(errorNotice).toContainText("Falha simulada ao concluir a leitura.");
  await expect(getDayOneScheduleButton(page)).toBeEnabled();
  await expect(getDayOneScheduleButton(page)).toContainText("Concluir");
  await expect(page.getByText("2026-10-30", { exact: true })).toBeVisible();
  await expect(page.getByText("2026-11-03", { exact: true })).toHaveCount(0);
});
