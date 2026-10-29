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
  forgotPasswordCalls: number;
  resetPasswordCalls: number;
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
    logoutCalls: 0,
    forgotPasswordCalls: 0,
    resetPasswordCalls: 0
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

    if (path.endsWith("/api/auth/password/forgot") && request.method() === "POST") {
      stats.forgotPasswordCalls += 1;
      return json(route, {
        success: true,
        message: "Se existir uma conta com esse e-mail, enviaremos as instruções de recuperação.",
        errors: null
      });
    }

    if (path.endsWith("/api/auth/password/reset") && request.method() === "POST") {
      stats.resetPasswordCalls += 1;
      const payload = request.postDataJSON() as { token?: string };

      if (payload.token === "invalid") {
        return json(route, {
          success: false,
          message: null,
          errors: ["Link de recuperacao invalido ou expirado."]
        }, 400);
      }

      return json(route, {
        success: true,
        message: "Senha redefinida com sucesso.",
        errors: null
      });
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

test("login oferece acesso por teclado ao fluxo de recuperacao", async ({ page }) => {
  await page.goto("/login");
  const recoveryLink = page.getByRole("link", { name: "Esqueci minha senha" });
  await expect(recoveryLink).toBeVisible();
  await recoveryLink.focus();
  await expect(recoveryLink).toBeFocused();
  await recoveryLink.press("Enter");
  await expect(page).toHaveURL(/\/esqueci-senha$/);
});

test("solicitacao de recuperacao mostra confirmacao generica", async ({ page }) => {
  const stats = await mockApi(page);
  await page.goto("/esqueci-senha");
  await page.getByLabel("E-mail").fill("qualquer@example.com");
  await page.getByRole("button", { name: "Enviar link de recuperação" }).click();

  await expect(page.getByRole("status")).toContainText("Se existir uma conta com esse e-mail");
  await expect(page.getByText("Por segurança, mostramos a mesma confirmação")).toBeVisible();
  expect(stats.forgotPasswordCalls).toBe(1);
});

test("reset valido conclui sem autenticar automaticamente", async ({ page }) => {
  const stats = await mockApi(page);
  await page.goto("/redefinir-senha?userId=11111111-2222-3333-4444-555555555555&token=valid");
  await page.getByLabel("Nova senha").fill("NovaSenha123");
  await page.getByLabel("Confirme a nova senha").fill("NovaSenha123");
  await page.getByRole("button", { name: "Redefinir senha" }).click();

  await expect(page.getByRole("heading", { name: "Senha redefinida" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Entrar com a nova senha" })).toHaveAttribute("href", "/login");
  expect(stats.resetPasswordCalls).toBe(1);
  expect(stats.loginCalls).toBe(0);
});

test("token invalido oferece solicitar novo link", async ({ page }) => {
  const stats = await mockApi(page);
  await page.goto("/redefinir-senha?userId=11111111-2222-3333-4444-555555555555&token=invalid");
  await page.getByLabel("Nova senha").fill("NovaSenha123");
  await page.getByLabel("Confirme a nova senha").fill("NovaSenha123");
  await page.getByRole("button", { name: "Redefinir senha" }).click();

  await expect(page.getByRole("alert")).toContainText("inválido ou expirou");
  expect(stats.resetPasswordCalls).toBe(1);
});

test("link sem parametros mostra estado invalido sem chamar reset", async ({ page }) => {
  const stats = await mockApi(page);
  await page.goto("/redefinir-senha");

  await expect(page.getByRole("heading", { name: "Link inválido" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Solicitar novo link" })).toHaveAttribute("href", "/esqueci-senha");
  expect(stats.resetPasswordCalls).toBe(0);
});

test("senhas divergentes sao rejeitadas antes da API", async ({ page }) => {
  const stats = await mockApi(page);
  await page.goto("/redefinir-senha?userId=11111111-2222-3333-4444-555555555555&token=valid");
  await page.getByLabel("Nova senha").fill("NovaSenha123");
  await page.getByLabel("Confirme a nova senha").fill("OutraSenha123");
  await page.getByRole("button", { name: "Redefinir senha" }).click();

  await expect(page.getByRole("alert")).toContainText("As senhas não conferem");
  expect(stats.resetPasswordCalls).toBe(0);
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

  test(`recuperacao sem overflow horizontal em ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/esqueci-senha");
    await expect(page.getByRole("heading", { name: "Esqueceu sua senha?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Enviar link de recuperação" })).toBeVisible();

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow).toBe(false);
  });
}
