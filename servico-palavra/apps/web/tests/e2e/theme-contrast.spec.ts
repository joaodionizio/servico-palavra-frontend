import { expect, test, type Locator, type Page, type Route } from "@playwright/test";

const usuario = {
  id: "00000000-0000-0000-0000-000000000001",
  nome: "Pessoa Teste",
  email: "teste@example.com",
  roles: []
};

const conteudo = {
  id: "formacao-1",
  slug: "formacao-contraste",
  titulo: "Formação para validar contraste",
  descricao: "Conteúdo usado para proteger a leitura nos temas claro e escuro.",
  tipo: "link",
  origem: "google_drive",
  url: "https://drive.google.com/file/d/teste/view",
  categoria: { id: "cat-1", nome: "Espiritualidade", slug: "espiritualidade" },
  publicado: true,
  favorito: false,
  concluido: false,
  materiaisApoio: []
};

const planId = "11111111-1111-1111-1111-111111111111";
const plano = {
  id: planId,
  nome: "Plano anual",
  duracaoDias: 365,
  duracaoAnos: 1,
  duracaoMeses: 0,
  dataInicio: "2026-10-30",
  dataFimPrevista: "2027-10-29",
  status: "Ativo"
};
const dias = [
  {
    id: "dia-1",
    diaNumero: 1,
    mesNumero: 1,
    dataPrevista: "2026-10-30",
    leiturasTexto: "João 1–4 e Salmos 1",
    concluido: false
  }
];

const dashboard = {
  conteudosConcluidos: 0,
  favoritos: 0,
  possuiPlanoBiblicoAtivo: true,
  formacoesRecentes: [conteudo],
  favoritosRecentes: [],
  conteudosComProgresso: [],
  planoBiblicoAtivo: {
    ...plano,
    diasConcluidos: 0,
    totalDias: 365,
    percentual: 0
  },
  leituraHoje: dias[0],
  estatisticas: {
    totalFavoritos: 0,
    totalConteudosConcluidos: 0,
    percentualPlanoBiblico: 0
  }
};

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
}

async function mockApi(page: Page) {
  await page.route("**/mock-api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path.endsWith("/api/auth/csrf")) return json(route, { success: true, data: { token: "test-csrf-token" } });
    if (path.endsWith("/api/auth/login") && request.method() === "POST") return json(route, { success: true, data: { usuario } });
    if (path.endsWith("/api/auth/me")) return json(route, { success: true, data: usuario });
    if (path.endsWith("/api/dashboard/me")) return json(route, { success: true, data: dashboard });
    if (path.endsWith("/api/categorias")) return json(route, { success: true, data: [conteudo.categoria] });
    if (path.endsWith("/api/conteudos/formacao-contraste")) return json(route, { success: true, data: conteudo });
    if (path.endsWith("/api/conteudos")) {
      return json(route, {
        success: true,
        data: { itens: [conteudo], pagina: 1, tamanhoPagina: 12, totalItens: 1, totalPaginas: 1 }
      });
    }
    if (path.endsWith("/api/planos-biblicos/ativo")) return json(route, { success: true, data: plano });
    if (path.endsWith(`/api/planos-biblicos/${planId}/dias`)) return json(route, { success: true, data: dias });
    if (path.endsWith("/api/auth/logout")) return json(route, { success: true });
    return json(route, { success: true, data: [] });
  });
}

async function signIn(page: Page, theme: "light" | "dark") {
  await page.addInitScript((selectedTheme) => {
    localStorage.setItem("servico-palavra-theme", selectedTheme);
  }, theme);
  await mockApi(page);
  await page.goto("/login");
  await page.getByPlaceholder("Seu email").fill("teste@example.com");
  await page.getByPlaceholder("Sua senha").fill("senha-teste");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/app(?:$|[/?#])/, { timeout: 10_000 });
  await expect(page.locator("html")).toHaveClass(theme === "dark" ? /dark/ : /^(?!.*\bdark\b)/);
}

function channel(value: number) {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(rgb: [number, number, number]) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

function contrastRatio(foreground: [number, number, number], background: [number, number, number]) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(value: string): [number, number, number] {
  const parts = value.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
  if (parts.length !== 3) throw new Error(`Cor CSS inesperada: ${value}`);
  return [parts[0], parts[1], parts[2]];
}

async function expectReadable(locator: Locator, minimum = 4.5) {
  await expect(locator).toBeVisible();
  const colors = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return { foreground: style.color, background: style.backgroundColor };
  });
  const ratio = contrastRatio(parseRgb(colors.foreground), parseRgb(colors.background));
  expect(ratio, `${colors.foreground} sobre ${colors.background}`).toBeGreaterThanOrEqual(minimum);
}

for (const theme of ["light", "dark"] as const) {
  test(`contraste global de ações e leitura permanece acessível no tema ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, theme);

    await page.goto("/app/formacoes");
    const search = page.getByLabel("Buscar formações por título ou tema");
    await search.fill("Formação");
    await expectReadable(search);
    await expectReadable(page.getByRole("link", { name: "Ver formação" }));

    await page.goto("/app/formacoes/formacao-contraste");
    await expect(page.getByRole("heading", { name: "Acesse a mídia da formação" })).toBeVisible();
    await expectReadable(page.getByRole("link", { name: "Abrir conteúdo" }));
    await expectReadable(page.getByRole("button", { name: "Favoritar" }));
    await expectReadable(page.getByRole("button", { name: "Marcar como concluído" }));

    const mediaHeading = page.getByRole("heading", { name: "Acesse a mídia da formação" });
    const headingColors = await mediaHeading.evaluate((element) => {
      const style = getComputedStyle(element);
      const parent = element.closest("section");
      return { foreground: style.color, background: parent ? getComputedStyle(parent).backgroundColor : "rgb(255, 255, 255)" };
    });
    expect(contrastRatio(parseRgb(headingColors.foreground), parseRgb(headingColors.background))).toBeGreaterThanOrEqual(4.5);

    await page.goto("/app/plano-biblico");
    await expect(page.getByText("Leitura do dia 1", { exact: true })).toBeVisible();
    await expectReadable(page.getByRole("button", { name: "Marcar como concluído" }));
  });
}
