import { expect, test, type Page, type Route } from "@playwright/test";

const adminUser = {
  id: "00000000-0000-0000-0000-000000000010",
  nome: "Pessoa Admin",
  email: "admin@example.com",
  roles: ["Admin"]
};

const regularUser = {
  ...adminUser,
  id: "00000000-0000-0000-0000-000000000011",
  nome: "Pessoa Comum",
  email: "pessoa@example.com",
  roles: []
};

const category = {
  id: "cat-1",
  nome: "Bíblia",
  slug: "biblia",
  descricao: "Formações bíblicas",
  cor: "#0A4F8F",
  icone: "book",
  ordem: 1,
  ativo: true
};

const content = {
  id: "conteudo-1",
  slug: "introducao-evangelhos",
  titulo: "Introdução aos Evangelhos",
  descricao: "Uma formação de teste para o painel administrativo.",
  resumo: "Resumo da formação",
  tipo: 1,
  origem: 1,
  url: "https://www.youtube.com/watch?v=test",
  urlThumbnail: "https://example.com/thumb.jpg",
  duracaoMinutos: 42,
  categoriaConteudoId: category.id,
  categoria: category,
  publicado: false,
  destaque: false,
  ordem: 1,
  materiaisApoio: []
};

async function json(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

type AdminMockOptions = {
  admin?: boolean;
  actionDelayMs?: number;
};

async function mockAdminApi(page: Page, options: AdminMockOptions = {}) {
  const user = options.admin === false ? regularUser : adminUser;
  let published = content.publicado;
  let categories = [category];

  await page.route("**/mock-api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    const method = request.method();

    if (path.endsWith("/api/auth/csrf")) {
      return json(route, { success: true, data: { token: "admin-csrf-token" } });
    }

    if (path.endsWith("/api/auth/me")) {
      return json(route, { success: true, data: user });
    }

    if (path.endsWith("/api/admin/categorias") && method === "GET") {
      return json(route, { success: true, data: categories });
    }

    if (path.endsWith("/api/admin/categorias") && method === "POST") {
      if (options.actionDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, options.actionDelayMs));
      }

      const payload = request.postDataJSON() as Record<string, unknown>;
      const created = {
        id: "cat-2",
        nome: String(payload.nome ?? "Nova categoria"),
        slug: "nova-categoria",
        descricao: String(payload.descricao ?? ""),
        cor: String(payload.cor ?? "#0A4F8F"),
        ordem: 2,
        ativo: true
      };
      categories = [...categories, created];
      return json(route, { success: true, data: created }, 201);
    }

    if (path.match(/\/api\/admin\/categorias\/[^/]+\/status$/) && method === "PATCH") {
      if (options.actionDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, options.actionDelayMs));
      }
      return route.fulfill({ status: 204 });
    }

    if (path.match(/\/api\/admin\/categorias\/[^/]+$/) && method === "PUT") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      const updated = { ...category, ...payload };
      categories = categories.map((item) => (item.id === category.id ? updated : item));
      return json(route, { success: true, data: updated });
    }

    if (path.match(/\/api\/admin\/categorias\/[^/]+$/) && method === "DELETE") {
      categories = categories.filter((item) => item.id !== category.id);
      return route.fulfill({ status: 204 });
    }

    if (path.endsWith("/api/admin/conteudos") && method === "POST") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      return json(route, { success: true, data: { ...content, ...payload, id: "conteudo-2" } }, 201);
    }

    if (path.includes("/api/admin/conteudos?") || (path.endsWith("/api/admin/conteudos") && method === "GET")) {
      return json(route, {
        success: true,
        data: {
          itens: [{ ...content, publicado: published }],
          pagina: 1,
          tamanhoPagina: 20,
          totalItens: 1,
          totalPaginas: 1
        }
      });
    }

    if (path.endsWith(`/api/admin/conteudos/${content.id}`) && method === "GET") {
      return json(route, { success: true, data: { ...content, publicado: published } });
    }

    if (path.endsWith(`/api/admin/conteudos/${content.id}`) && method === "PUT") {
      const payload = request.postDataJSON() as Record<string, unknown>;
      return json(route, { success: true, data: { ...content, ...payload, publicado: published } });
    }

    if (path.endsWith(`/api/admin/conteudos/${content.id}/publicacao`) && method === "PATCH") {
      if (options.actionDelayMs) {
        await new Promise((resolve) => setTimeout(resolve, options.actionDelayMs));
      }
      const payload = request.postDataJSON() as { publicado?: boolean };
      published = Boolean(payload.publicado);
      return route.fulfill({ status: 204 });
    }

    if (path.endsWith(`/api/admin/conteudos/${content.id}`) && method === "DELETE") {
      return route.fulfill({ status: 204 });
    }

    if (path.endsWith("/api/auth/logout")) {
      return json(route, { success: true });
    }

    return json(route, { success: true, data: [] });
  });
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

const adminRoutes = [
  { path: "/admin/conteudos", heading: "Conteúdos" },
  { path: "/admin/categorias", heading: "Categorias" },
  { path: "/admin/conteudos/novo", heading: "Novo conteúdo" },
  { path: `/admin/conteudos/${content.id}/editar`, heading: "Editar conteúdo" }
];

for (const viewport of viewports) {
  for (const route of adminRoutes) {
    test(`admin ${route.path} sem overflow horizontal em ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await mockAdminApi(page);
      await page.goto(route.path);
      await expect(page.getByRole("heading", { name: route.heading, exact: true })).toBeVisible();
      await expectNoHorizontalOverflow(page);
    });
  }
}

test("admin conteúdos usa loading e feedback acessível ao publicar", async ({ page }) => {
  await mockAdminApi(page, { actionDelayMs: 300 });
  await page.goto("/admin/conteudos");
  await expect(page.getByRole("heading", { name: "Conteúdos", exact: true })).toBeVisible();

  const publishButton = page.getByRole("button", { name: "Publicar", exact: true });
  await publishButton.click();
  await expect(publishButton).toHaveAttribute("aria-busy", "true");
  await expect(publishButton).toBeDisabled();

  await expect(page.locator('.status-notice[role="status"]')).toContainText("Conteúdo publicado.");
  await expect(page.getByText("Publicado", { exact: true })).toBeVisible();
});

test("admin categorias cria categoria com loading e confirmação acessível", async ({ page }) => {
  await mockAdminApi(page, { actionDelayMs: 300 });
  await page.goto("/admin/categorias");
  await expect(page.getByRole("heading", { name: "Categorias", exact: true })).toBeVisible();

  await page.getByLabel(/^Nome/).fill("Liturgia");
  const createButton = page.getByRole("button", { name: "Criar categoria", exact: true });
  await createButton.click();
  await expect(createButton).toHaveAttribute("aria-busy", "true");
  await expect(createButton).toBeDisabled();

  await expect(page.locator('.status-notice[role="status"]')).toContainText("Categoria criada.");
  await expect(page.getByText("Liturgia", { exact: true })).toBeVisible();
});

test("usuário sem role Admin permanece bloqueado", async ({ page }) => {
  await mockAdminApi(page, { admin: false });
  await page.goto("/admin/conteudos");

  await expect(page.getByRole("heading", { name: "Área administrativa" })).toBeVisible();
  await expect(page.getByText("Sua conta não possui permissão de administrador para acessar esta área.")).toBeVisible();
});

test("admin root direciona para conteúdos", async ({ page }) => {
  await mockAdminApi(page);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/conteudos/);
  await expect(page.getByRole("heading", { name: "Conteúdos", exact: true })).toBeVisible();
});
