# Story E10-FE-01 — Final Product Gate

Status: blocked  
Prioridade: P0  
Bloqueio atual: validacao/deploy no ambiente real de producao; Vercel reportando build-rate-limit no plano atual.

## Objetivo
Executar o gate final antes do deploy publico, validando frontend, backend, integracao e configuracao operacional real sem custo adicional.

## Estado atual

### Concluido
- E9-FE-01 Admin Experience: `done / APPROVED`.
- Backend E0–E4: todos `done`.
- Backend Verify no HEAD `de72d4dd8e379d31a737d6e7b3ba1e93a5af62d9`: `success` (run `40983588071`).
- Frontend E0–E9 implementados e E9 validado no run `40984056070`: `success`.
- audit de dependencias de producao do frontend: 0 vulnerabilidades high/critical no gate.
- build Next.js de producao verde.
- responsividade automatizada cobre 320/390/768/1024/1440.
- E2E cobre autenticacao, recuperacao de senha, plano adaptativo, acessibilidade e admin.
- proxy same-origin `/api/backend` confirmado no codigo.
- `API_BACKEND_URL` permanece server-side.
- timezone padrao do backend: `America/Sao_Paulo` em `appsettings.json`.
- configuracao SMTP documentada sem segredos versionados.
- smoke de producao sem credenciais criado em `scripts/production-smoke.mjs`.
- README de producao corrigido para usar `/api/backend`, evitando URL direta do Render no browser.

### Bloqueado externamente
O status de deploy Vercel associado aos commits atuais retorna `failure` com destino `upgradeToPro=build-rate-limit`. Como o requisito do projeto e nao adicionar custo recorrente, o release nao deve comprar upgrade apenas para contornar a cota.

As integracoes Vercel e Render estao instaladas no ChatGPT, mas os actions/namespaces delas ainda nao foram expostos no registry desta sessao. Portanto nao foi possivel inspecionar ou alterar variaveis dos providers diretamente por ferramenta nesta mesma sessao.

## Configuracao de producao esperada

### Frontend / Vercel
```bash
NEXT_PUBLIC_API_URL=/api/backend
API_BACKEND_URL=https://servico-palavra-api.onrender.com
```

### Backend / Render
Obrigatorio conferir no provider, sem copiar valores secretos para GitHub/chat:

- `ASPNETCORE_ENVIRONMENT=Production`
- `DATABASE_PROVIDER=postgresql`
- `ConnectionStrings__DefaultConnection`
- `ALLOWED_ORIGINS=<origem real da Vercel>`
- `FRONTEND_BASE_URL=<origem real da Vercel>`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM_ADDRESS`
- `SMTP_FROM_NAME`
- `SMTP_ENABLE_SSL`
- `Calendar__TimeZone=America/Sao_Paulo` opcional se quiser sobrescrever explicitamente o default do `appsettings.json`
- `Observability__SlowRequestThresholdMs=1000` opcional
- credenciais bootstrap Admin somente se ainda necessarias; remover/rotacionar apos bootstrap.

## Smoke automatizado pos-deploy

Na raiz do frontend:

```bash
PRODUCTION_BASE_URL=https://<dominio-vercel> npm run smoke:production
```

Valida sem credenciais:
- `/login`;
- `/esqueci-senha`;
- headers de seguranca;
- proxy Vercel → Render;
- `/health`;
- `Server-Timing` do backend;
- endpoint/token/cookie CSRF via mesma origem.

## Smoke manual controlado apos deploy

1. Login e logout com conta real de teste.
2. Sessao expirada/401 redireciona corretamente.
3. Solicitar recuperacao para conta existente e inexistente; resposta publica deve ser indistinguivel.
4. Confirmar recebimento de e-mail e URL de reset apontando para o dominio real do frontend.
5. Resetar senha e confirmar que senha anterior deixa de funcionar.
6. Dashboard e formacoes carregam.
7. Plano biblico e cronograma exibem datas locais corretas.
8. Concluir uma leitura e confirmar redistribuicao adaptativa sem reload manual.
9. Perfil salva alteracoes.
10. Admin: listar, filtrar, criar/editar e publicar/despublicar com role Admin.
11. Conferir mobile real e desktop para overflow/foco/dark mode.

## Rollback

Se o smoke pos-deploy falhar:
- Vercel: promover/reverter para o ultimo deployment anteriormente saudavel.
- Render: reimplantar o commit backend anterior saudavel; nao reverter migration destrutivamente sem analise.
- Se o problema for apenas variavel de ambiente, corrigir a configuracao e redeployar sem alterar codigo.
- Manter o banco atual; as features desta rodada nao exigiram migration nova para recuperacao de senha ou calendario adaptativo.

## Criterios de aceitacao
1. E9 esta `done / APPROVED`. **OK**
2. Frontend Verify completo esta verde no HEAD final. **PENDENTE do commit final de release**
3. Backend Verify completo esta verde no HEAD final. **OK**
4. Nao existem vulnerabilidades high/critical conhecidas nas dependencias de producao auditadas. **OK no gate local/CI**
5. Variaveis obrigatorias de producao foram conferidas no provider sem expor secrets. **PENDENTE provider**
6. Recuperacao de senha funciona no dominio real e o link aponta para o frontend correto. **PENDENTE pos-deploy**
7. Login/logout/sessao/CSRF funcionam no ambiente publicado. **PENDENTE pos-deploy**
8. Dashboard, formacoes, plano, cronograma e admin passam smoke pos-deploy. **PENDENTE pos-deploy**
9. Calendario usa o dia civil correto para `America/Sao_Paulo` em producao. **Implementacao/testes OK; PENDENTE smoke real**
10. Responsividade e foco/teclado nao apresentam regressao no build publicado. **CI OK; PENDENTE smoke real**
11. Existe procedimento simples de rollback. **OK**
12. Review final retorna `APPROVED`. **PENDENTE itens externos**

## Regra de release
Enquanto qualquer criterio pendente acima permanecer, E10 fica `blocked` e o produto nao e marcado como deploy definitivo concluido.

## Definition of Done
Deploy realizado e smoke pos-deploy aprovado, com evidencias registradas e sem bloqueantes conhecidos.
