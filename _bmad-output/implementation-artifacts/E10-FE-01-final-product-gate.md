# Story E10-FE-01 — Final Product Gate

Status: blocked  
Prioridade: P0  
Bloqueio atual: E9-FE-01 Admin Experience + validação de configuração real de produção.

## Objetivo
Executar o gate final antes do deploy público, validando frontend, backend, integração e configuração operacional real sem custo adicional.

## Escopo
- exigir CI verde do frontend e backend no HEAD final;
- confirmar ausência de vulnerabilidades high/critical em dependências de produção;
- executar smoke E2E dos fluxos críticos: login, logout, recuperação de senha, dashboard, formações, plano bíblico adaptativo, cronograma, perfil e admin;
- confirmar responsividade 320/390/768/1024/1440 e gates de acessibilidade existentes;
- validar configuração de produção do frontend (`NEXT_PUBLIC_API_URL`/proxy same-origin conforme arquitetura);
- validar configuração do backend: banco, CORS/origins, `FRONTEND_BASE_URL`, SMTP, timezone de calendário e bootstrap admin quando aplicável;
- confirmar que nenhum secret real está versionado no GitHub;
- validar que recuperação de senha gera link apontando para a URL real do frontend;
- validar que cookies/CSRF funcionam no domínio real após deploy;
- executar smoke pós-deploy e registrar resultado/rollback plan.

## Variáveis/configurações de produção que precisam ser verificadas
### Backend
- `ConnectionStrings__DefaultConnection`
- `ALLOWED_ORIGINS`
- `FRONTEND_BASE_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_ADDRESS`
- `SMTP_FROM_NAME`
- `SMTP_ENABLE_SSL`
- `Calendar__TimeZone=America/Sao_Paulo` (ou configuração equivalente suportada pela aplicação)
- credenciais bootstrap admin somente se ainda necessárias ao ambiente

### Frontend
- URL/proxy da API compatível com cookies first-party e CSRF
- domínio de produção coerente com `FRONTEND_BASE_URL` do backend

## Critérios de aceitação
1. E9 está `done / APPROVED`.
2. Frontend Verify completo está verde no HEAD final.
3. Backend Verify completo está verde no HEAD final.
4. Não existem vulnerabilidades high/critical conhecidas nas dependências de produção auditadas.
5. Variáveis obrigatórias de produção foram conferidas no provedor sem expor secrets em código/log.
6. Recuperação de senha funciona no domínio real e o link de reset aponta para o frontend correto.
7. Login/logout/sessão/CSRF funcionam no ambiente publicado.
8. Dashboard, formações, plano, cronograma e admin passam smoke pós-deploy.
9. Calendário usa o dia civil correto para `America/Sao_Paulo` em produção.
10. Responsividade e foco/teclado não apresentam regressão no build publicado.
11. Existe procedimento simples de rollback para a versão anterior caso o smoke pós-deploy falhe.
12. Review final retorna `APPROVED`.

## Regra de release
Enquanto qualquer critério 1–12 estiver pendente, o produto não é considerado liberado para deploy definitivo.

## Definition of Done
Deploy realizado e smoke pós-deploy aprovado, com evidência registrada e sem bloqueantes conhecidos.
