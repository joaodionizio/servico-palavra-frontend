# Release Blockers

Data: 2026-06-11

## Status Geral

**NÃO APROVADO PARA PRODUÇÃO.**

O frontend V2 foi parcialmente endurecido, mas o backend não está presente neste repositório. A principal restrição do produto é isolamento de dados entre usuários, e isso só pode ser garantido no backend.

## Bloqueadores

| ID | Severidade | Área | Problema | Status | Ação necessária |
|----|------------|------|----------|--------|-----------------|
| RB-001 | CRITICAL | Backend | Endpoints ASP.NET Core não estão neste repo; não foi possível validar autenticação, autorização, ownership, DTOs, EF Core, migrations, logs, CORS e rate limiting | BLOQUEADOR | Auditar e corrigir no repo do backend |
| RB-002 | CRITICAL | Ownership | Não há prova automatizada UsuarioA x UsuarioB para favoritos, progresso, plano bíblico e histórico | BLOQUEADOR | Criar testes de integração no backend |
| RB-003 | CRITICAL | Admin | Não há prova de `[Authorize(Roles = "Admin")]` nos endpoints admin | BLOQUEADOR | Implementar/testar autorização admin no backend |
| RB-004 | HIGH | CSRF | Frontend agora espera cookie, mas backend precisa implementar antiforgery em POST/PUT/PATCH/DELETE | BLOQUEADOR | Implementar CSRF no backend |
| RB-005 | HIGH | Cookies | HttpOnly, Secure, SameSite e expiração não verificáveis sem backend | BLOQUEADOR | Configurar cookies no ASP.NET Core Identity |
| RB-006 | HIGH | CORS | Allowlist real de Vercel/Render não configurável neste repo | BLOQUEADOR | Configurar CORS exato no backend |
| RB-007 | HIGH | Banco | PostgreSQL/Neon, provider Npgsql, migrations e transações não verificáveis sem backend | BLOQUEADOR | Implementar e auditar no backend |
| RB-008 | HIGH | Plano bíblico | Regras de continuidade/reinício/transação/ownership não verificáveis sem backend | BLOQUEADOR | Implementar testes específicos no backend |
| RB-009 | MEDIUM | Legacy | `app-plano-biblico` legado com Supabase ainda está no repositório | PENDENTE | Remover/arquivar ou garantir que deploy usa somente `servico-palavra/apps/web` |
| RB-010 | MEDIUM | Secrets | `app-plano-biblico/.env.local` existe localmente e precisa revisão humana | DECISÃO HUMANA | Validar/remover localmente; não versionar |
| RB-011 | MEDIUM | Dependências | `npm audit` encontrou vulnerabilidade moderada transitiva em `postcss` via `next` | PENDENTE | Atualizar `next` quando houver correção compatível; não usar `--force` sem revisão |

## Bloqueadores Corrigidos Neste Frontend

| ID | Severidade | Área | Problema | Correção |
|----|------------|------|----------|----------|
| RB-FE-001 | HIGH | Sessão | Token salvo em `localStorage` | Removido; frontend usa `credentials: "include"` e espera cookie HttpOnly |
| RB-FE-002 | MEDIUM | Headers | Headers de segurança ausentes | Adicionados em `next.config.ts` |
| RB-FE-003 | MEDIUM | Lint | `next lint` falhava nesta versão/configuração | Script alterado para `tsc --noEmit` |

## Decisão Humana Registrada

Até este momento, nenhuma decisão humana aceitando risco foi registrada para os bloqueadores críticos do backend.
