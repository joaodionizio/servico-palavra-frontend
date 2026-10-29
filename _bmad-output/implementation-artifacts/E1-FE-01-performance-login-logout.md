# Story E1-FE-01 — Remover round-trip e delays artificiais de autenticação

Status: done  
Prioridade: P0

## Objetivo
Reduzir a latência percebida de login e logout sem remover a identidade visual da experiência.

## Contexto
Antes desta story, o backend já retornava `AuthResponse.Usuario` no login, mas `useAuth.signIn` executava um segundo `GET /api/auth/me`. Depois disso, `LoginForm` forçava até 450 ms de feedback e mais 1150 ms de animação antes de navegar. O logout também esperava artificialmente 450 ms em paralelo ao `signOut`.

## Implementação
- `useAuth.signIn` passou a usar diretamente `response.usuario`.
- `getMe()` foi preservado para bootstrap/refresh real de sessão, mas saiu do caminho feliz imediatamente após login.
- removidos os waits artificiais de 450 ms e 1150 ms do login.
- removido o wait artificial de 450 ms do logout.
- o feedback de loading continua ligado ao tempo real da requisição.
- CSRF, cookies e tratamento global de 401 não foram alterados.
- o efeito visual do livro pode iniciar, mas não bloqueia mais a navegação.

## Medição
Antes:
- caminho feliz do login: 1 `POST /api/auth/login` + 1 `GET /api/auth/me` redundante;
- atraso artificial de até ~1600 ms após autenticação;
- logout adicionava pelo menos 450 ms.

Depois:
- caminho feliz validado por E2E: 1 `POST /api/auth/login` e **0 `GET /api/auth/me` redundante**;
- navegação inicia quando a requisição real termina;
- logout navega quando `POST /api/auth/logout` termina, sem timer adicional.

## Testes
O smoke Playwright passou a manter contadores de chamadas para impedir regressão:
- `loginCalls` deve ser 1;
- `authMeCalls` deve ser 0 após login bem-sucedido;
- `logoutCalls` deve ser 1 no logout.

Também permanecem verdes os testes de sessão expirada, menu mobile e overflow em 320/390/768/1024/1440.

## Verificação
`Frontend Verify` run `40968722497`: **success**.

O gate incluiu:
- `npm ci`;
- audit de produção;
- type-check;
- ESLint;
- build Next de produção;
- Playwright/Chromium.

## Code review adversarial
Resultado: **APPROVED**.

Achados bloqueantes: nenhum.

Observações:
- O estado de autenticação é atualizado antes da navegação, portanto o `AuthGate` encontra usuário/status autenticado sem precisar revalidar `/me`.
- `getMe()` continua disponível quando há necessidade real de reconstruir ou forçar a sessão.
- O botão permanece em loading após sucesso até a página atual desmontar, evitando dupla submissão durante a navegação.
- A animação antiga deixa de controlar o tempo de resposta do produto; refinamentos visuais não bloqueantes pertencem ao épico de motion/UX.

## Critérios de aceitação
1. sem `GET /me` redundante — **atendido e testado**;
2. usuário do login alimenta `AuthProvider` — **atendido**;
3. sem waits de 450/1150 ms no login — **atendido**;
4. sem wait de 450 ms no logout — **atendido**;
5. loading ligado à requisição real — **atendido**;
6. erros continuam sem navegação — **preservado**;
7. 401/sessão expirada — **testado**;
8. CSRF/cookies — **preservados**;
9. login/dashboard e logout/login em E2E — **atendidos**;
10. baseline responsivo/reduced-motion preservado — **atendido pelo gate existente**.

## Definition of Done
Concluída e aprovada.
