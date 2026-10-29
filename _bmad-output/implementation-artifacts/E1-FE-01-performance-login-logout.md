# Story E1-FE-01 — Remover round-trip e delays artificiais de autenticação

Status: in-progress  
Prioridade: P0

## Objetivo
Reduzir a latência percebida de login e logout sem remover a identidade visual da experiência.

## Contexto
Antes desta story, o backend já retornava `AuthResponse.Usuario` no login, mas `useAuth.signIn` executava um segundo `GET /api/auth/me`. Depois disso, `LoginForm` forçava até 450 ms de feedback e mais 1150 ms de animação antes de navegar. O logout também esperava artificialmente 450 ms em paralelo ao `signOut`.

## Escopo
- usar diretamente o usuário retornado por `login()` como estado autenticado;
- remover o `GET /api/auth/me` redundante do caminho feliz do login;
- manter `getMe()` para bootstrap/refresh de sessão quando realmente necessário;
- remover esperas artificiais que bloqueiam navegação no login e logout;
- preservar feedback visual imediato e, quando possível, permitir que motion acompanhe sem impedir navegação;
- preservar mensagens de erro, sessão expirada, CSRF e cookies;
- adicionar/ajustar testes E2E para provar o comportamento.

## Fora de escopo
- recuperação de senha;
- redesign da tela de login;
- alterações no backend;
- mudança da política de duração da sessão.

## Critérios de aceitação
1. Um login bem-sucedido não executa `GET /api/auth/me` imediatamente após `POST /api/auth/login` apenas para obter os mesmos dados.
2. O usuário retornado pelo login alimenta o `AuthProvider` e permite acesso ao `/app` sem refresh adicional no caminho feliz.
3. Não existe `setTimeout` obrigatório que segure a navegação por 450 ms ou 1150 ms após autenticação bem-sucedida.
4. O logout não adiciona espera mínima artificial de 450 ms.
5. O botão continua mostrando estado de processamento enquanto a requisição real está em andamento.
6. Erro de credenciais continua sendo exibido sem navegar.
7. O tratamento global de 401/sessão expirada continua funcional.
8. CSRF e `credentials: include` não são removidos ou enfraquecidos.
9. E2E comprova login → dashboard e logout → login com API mockada.
10. A alteração não introduz regressão visual em mobile/desktop e respeita `prefers-reduced-motion` quando houver animação.

## Implementação em andamento
- `useAuth.signIn` passou a usar diretamente `response.usuario`.
- removidos os waits artificiais de 450 ms e 1150 ms do login.
- removido wait artificial de 450 ms do logout.
- E2E agora conta `POST /login`, `GET /me` e `POST /logout` para impedir regressão de rede.

## Medição
Antes:
- caminho feliz do login: `POST /login` + `GET /me`;
- atraso artificial de até ~1600 ms após autenticação;
- logout adicionava pelo menos 450 ms.

Depois esperado:
- caminho feliz: 1 `POST /login`, 0 `GET /me` redundante;
- navegação inicia assim que a requisição real termina;
- logout navega assim que `POST /logout` termina.

## Arquivos alterados
- `servico-palavra/apps/web/src/hooks/useAuth.ts`
- `servico-palavra/apps/web/src/components/auth/LoginForm.tsx`
- `servico-palavra/apps/web/src/components/layout/AppShell.tsx`
- `servico-palavra/apps/web/tests/e2e/smoke.spec.ts`

## Riscos
- animação de login depender da permanência da página atual;
- algum componente assumir que `getMe()` sempre roda logo após login;
- race condition entre navegação e atualização do contexto.

## Definition of Done
- critérios 1–10 atendidos;
- `npm run verify` verde;
- chamadas de rede no E2E validam ausência do `GET /me` redundante;
- story movida para `review`;
- `bmad-code-review` independente aprovado.
