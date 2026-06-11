# Dependency Audit

Data: 2026-06-11

## Escopo

- Frontend V2: `servico-palavra/apps/web`
- Root package: delega scripts para o frontend V2
- Backend: não presente

## Dependências Diretas do Frontend V2

| Pacote | Tipo |
|--------|------|
| next | runtime |
| react | runtime |
| react-dom | runtime |
| tailwindcss | dev |
| typescript | dev |
| @tailwindcss/postcss | dev |
| @types/node | dev |
| @types/react | dev |
| @types/react-dom | dev |

## Verificações Executadas

| Comando | Resultado | Observação |
|---------|-----------|------------|
| `npm run build` | PASSOU | Build Next.js gerou 24 rotas com sucesso |
| `npm --prefix servico-palavra/apps/web run lint` | PASSOU | Script ajustado para `tsc --noEmit`, pois `next lint` falhava nesta versão/configuração |
| `npm --prefix servico-palavra/apps/web audit` | FALHOU COM ACHADO | 2 vulnerabilidades moderadas transitivas em `postcss` via `next` |

## Achados do `npm audit`

| ID | Severidade | Dependência | Origem | Status | Ação |
|----|------------|-------------|--------|--------|------|
| DEP-001 | MEDIUM | `postcss <8.5.10` | Dependência transitiva de `next` | PENDENTE | Não aplicar `npm audit fix --force`; monitorar versão corrigida de `next` e atualizar sem downgrade/breaking change |

Detalhe: o npm sugeriu `npm audit fix --force`, mas isso instalaria versão incompatível/breaking de `next`. A atualização major/downgrade não foi aplicada cegamente.

## Verificações de Código Frontend

- `rg localStorage/sessionStorage/Bearer/Authorization` em `servico-palavra/apps/web/src`: sem ocorrências.
- `rg dangerouslySetInnerHTML` em `servico-palavra/apps/web/src`: sem ocorrências.

## Backend

Não executado neste repo:

- `dotnet restore`
- `dotnet build`
- `dotnet test`
- `dotnet list package --vulnerable --include-transitive`
- `dotnet list package --outdated`

Motivo: backend ausente.

## Risco Legado

`app-plano-biblico` possui dependências próprias e Supabase. Se o app legado permanecer no repo, ele precisa de auditoria separada ou remoção antes do deploy.

## Observação de Ambiente Local

Uma tentativa de `npm --prefix servico-palavra/apps/web install --package-lock-only` falhou por permissão no cache local do npm em `/Users/joaodionizio/.npm`. Nenhuma correção destrutiva de permissões globais foi aplicada.
