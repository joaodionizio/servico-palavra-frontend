import { expect, test, type Page, type Route } from "@playwright/test";

const usuario = {
  id: "00000000-0000-0000-0000-000000000001",
  nome: "Pessoa Teste",
  email: "teste@example.com",
  roles: []
};

const planId = "11111111-1111-1111-1111-111111111111";

const dashboard = {
  conteudosConcluidos: 4,
  favoritos: 2,
  possuiPlanoBiblicoAtivo: true,
  formacoesRecentes: [
    {
      id: "formacao-1",
      slug: "formacao-com-titulo-longo",
      titulo: "Formação bíblica com um título propositalmente longo para validar a recomposição responsiva",
      descricao: "Conteúdo de formação com descrição suficiente para ocupar mais de uma linha sem forçar largura horizontal.",
      tipo: "video",
      origem: "youtube",
      categoriaNome: "Espiritualidade",
      duracao: "42 min"
    },
    {
      id: "formacao-2",
      slug: "lectio-divina",
      titulo: "Lectio Divina na vida cotidiana",
      descricao: "Prática de oração e leitura.",
      tipo: "audio",
      categoriaNome: "Oração"
    },
    {
      id: "formacao-3",
      slug: "evangelhos",
      titulo: "Introdução aos Evangelhos",
      descricao: "Uma visão pastoral dos Evangelhos.",
      tipo: "texto",
      categoriaNome: "Bíblia"
    }
  ],
  favoritosRecentes: [],
  conteudosComProgresso: [
    {
      id: "progresso-1",
      slug: "formacao-em-andamento",
      titulo: "Formação em andamento",
      descricao: "Continue de onde parou.",
      tipo: "video",
      percentual: 45
    }
  ],
  planoBiblicoAtivo: {
    id: planId,
    nome: "Plano anual",
    duracaoDias: 365,
    duracaoAnos: 1,
    duracaoMeses: 0,
    dataInicio: "2026-10-01",
    dataFimPrevista: "2027-10-01",
    diasConcluidos: 28,
    totalDias: 365,
    percentual: 7.67
  },
  leituraHoje: {
    id: "dia-29",
    diaNumero: 29,
    mesNumero: 1,
    dataPrevista: "2026-10-29",
    leiturasTexto: "João 1–3 e Salmo 23",
    concluido: false
  },
  estatisticas: {
    totalFavoritos: 2,
    totalConteudosConcluidos: 4,
    percentualPlanoBiblico: 7.67
  }
};

const planoAtivo = {
  id: planId,
  nome: "Plano anual",
  duracaoDias: 365,
  duracaoAnos: 1,
  duracaoMeses: 0,
  dataInicio: "2026-10-01",
  dataFimPrevista: "2027-10-01",
  status: "Ativo"
};

const dias = Array.from({ length: 7 }, (_, index) => ({
  id: `dia-${index + 1}`,
  diaNumero: index + 1,
  mesNumero: 1,
  dataPrevista: `2026-10-${String(29 + index).padStart(2, "0")}`,
  leiturasTexto: index === 0
    ? "Gênesis 1–3, João 1 e uma referência longa para testar quebra de linha no cronograma"
    : `Leitura bíblica do dia ${index + 1}`,
  concluido: index === 0
}));

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

async function expectNoHorizontalOverflow(page: Page) {
  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth
  }));

  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  expect(layout.bodyScrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
}

const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
];

for (const viewport of viewports) {
  test(`dashboard autenticado sem overflow horizontal em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await signIn(page);

    await expect(page.getByRole("heading", { name: "Sua jornada de formação" })).toBeVisible();
    await expect(page.getByText("Formação bíblica com um título propositalmente longo", { exact: false }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);

    if (viewport.width < 1024) {
      const menuButton = page.getByRole("button", { name: "Abrir menu" });
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      await expect(menuButton).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("link", { name: "Cronograma", exact: true })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute("aria-expanded", "false");
    }
  });

  test(`plano biblico sem overflow horizontal em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await signIn(page);
    await page.goto("/app/plano-biblico");

    await expect(page.getByText("Leitura do dia 1", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Desmarcar leitura" })).toBeVisible();
    await expect(page.getByText("Gênesis 1–3", { exact: false }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}
