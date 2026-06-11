# Security Report

Data: 2026-06-11

## 1. Resumo Executivo

O frontend V2 foi auditado no escopo disponível. O principal problema verificável era armazenamento de token no `localStorage`; isso foi corrigido para um modelo preparado para cookie HttpOnly via backend.

O backend não está neste repositório. Portanto, a segurança principal do produto, especialmente isolamento entre usuários, não pode ser considerada validada.

## 2. Status Geral

**NÃO APROVADO PARA PRODUÇÃO.**

Motivo: bloqueadores críticos dependem do backend separado.

## 3. Arquitetura Analisada

- Frontend V2 Next.js em `servico-palavra/apps/web`.
- App legado Supabase em `app-plano-biblico`.
- Backend ASP.NET Core ausente.

## 4. Dados Pessoais Tratados

- Nome.
- E-mail.
- Role/perfil.
- Favoritos.
- Progresso.
- Plano bíblico.
- Histórico de planos.
- Dados administrativos agregados.

## 5. Riscos Críticos

| ID | Severidade | Área | Problema | Impacto | Correção | Status |
|----|------------|------|----------|---------|----------|--------|
| SEC-001 | CRITICAL | Backend | Backend ausente, sem validação de ownership neste repo | Vazamento/alteração entre usuários | Auditar backend separado | BLOQUEADOR |
| SEC-002 | CRITICAL | Admin | Endpoints admin não verificados | Escalada de privilégio | `[Authorize(Roles="Admin")]` e testes | BLOQUEADOR |
| SEC-003 | CRITICAL | Plano bíblico | Regras de plano não verificadas server-side | Acesso cruzado/corrupção | Serviços transacionais e testes | BLOQUEADOR |

## 6. Riscos Altos

| ID | Severidade | Área | Problema | Impacto | Correção | Status |
|----|------------|------|----------|---------|----------|--------|
| SEC-004 | HIGH | Sessão | Token em `localStorage` | Roubo via XSS | Removido; cookie-based preparado | CORRIGIDO |
| SEC-005 | HIGH | CSRF | Backend cookie auth precisa antiforgery | Escrita indevida | Implementar no backend | BLOQUEADOR |
| SEC-006 | HIGH | CORS | Allowlist real não verificada | Sessão exposta a origem errada | Configurar backend | BLOQUEADOR |
| SEC-007 | HIGH | Legacy | App legado Supabase no repo | Deploy/confusão/manutenção insegura | Remover ou isolar | PENDENTE |

## 7. Riscos Médios

| ID | Severidade | Área | Problema | Impacto | Correção | Status |
|----|------------|------|----------|---------|----------|--------|
| SEC-008 | MEDIUM | Headers | Headers de segurança ausentes | Hardening fraco | Adicionados em Next.js | CORRIGIDO |
| SEC-009 | MEDIUM | Secrets | `.env.local` legado local | Possível segredo local | Revisão humana | PENDENTE |
| SEC-010 | MEDIUM | Histórico | Variáveis sensíveis citadas em commits antigos | Risco se valores reais existiram | Rotacionar se necessário | PENDENTE |

## 8. Riscos Baixos

| ID | Severidade | Área | Problema | Impacto | Correção | Status |
|----|------------|------|----------|---------|----------|--------|
| SEC-011 | LOW | Frontend | Mocks em `src/data/mocks.ts` | Dados falsos em ambiente real | Trocar por API antes de prod | PENDENTE |

## 9. Correções Aplicadas

- Removido uso de token no `localStorage`.
- `fetch` agora usa `credentials: "include"`.
- Login/cadastro esperam sessão por cookie definida pelo backend.
- `AuthGate` valida sessão via `GET /api/auth/me`.
- Logout chama `POST /api/auth/logout`.
- Headers de segurança configurados em `next.config.ts`.

## 10. Correções Pendentes

- Auditar backend separado.
- Implementar ASP.NET Core Identity.
- Implementar authorization/ownership em todos os endpoints.
- Implementar CSRF.
- Configurar CORS exato.
- Configurar PostgreSQL/Npgsql para produção.
- Criar testes de integração UsuarioA x UsuarioB.
- Remover ou isolar app legado Supabase.

## 11. Testes Criados

Neste repo foram criadas matrizes e roteiros documentais. Testes automatizados backend não foram criados por ausência do backend.

## 12. Testes Executados

| Comando | Resultado |
|---------|-----------|
| `npm run build` | PASSOU |
| `npm --prefix servico-palavra/apps/web run lint` | PASSOU |
| `npm --prefix servico-palavra/apps/web audit` | FALHOU com 2 achados moderados em dependência transitiva |
| `rg localStorage/sessionStorage/Bearer/Authorization servico-palavra/apps/web/src` | PASSOU, sem ocorrências |
| `rg dangerouslySetInnerHTML servico-palavra/apps/web/src` | PASSOU, sem ocorrências |

## 13. Resultados

Build e typecheck passaram. `npm audit` encontrou vulnerabilidade moderada transitiva em `postcss` via `next`; a correção automática sugerida exigia `--force` com mudança incompatível, então foi registrada como pendente em `DEPENDENCY_AUDIT.md`.

## 14. Bloqueadores de Deploy

Ver `docs/security/RELEASE_BLOCKERS.md`.

## 15. Decisões Humanas Necessárias

- Auditar backend no repo correto.
- Confirmar destino do app legado.
- Definir domínios finais de frontend/API.
- Definir processo de bootstrap admin.
- Revisar `.env.local` legado localmente.

## 16. Checklist Antes de Produção

Ver `docs/security/PRE_DEPLOY_SECURITY_CHECKLIST.md`.

## 17. Conclusão Honesta

O frontend V2 ficou mais seguro contra o blocker de token em `localStorage` e recebeu headers de segurança. A aplicação como produto ainda não pode ser considerada segura até que o backend separado prove autenticação, autorização, ownership, transações, CSRF, CORS, logs e testes de isolamento.
