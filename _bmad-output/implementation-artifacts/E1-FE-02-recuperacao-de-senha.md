# Story E1-FE-02 — Fluxo de recuperação de senha

Status: backlog  
Prioridade: P0  
Dependência: E1-BE-01-recuperacao-de-senha

## Objetivo
Adicionar um fluxo completo, responsivo e acessível de “Esqueci minha senha” e redefinição de senha integrado ao backend Identity.

## Escopo
- link “Esqueci minha senha?” na tela de login;
- página pública `/esqueci-senha`;
- página pública `/redefinir-senha` lendo `userId` e `token` da URL;
- funções de API para solicitar e concluir reset;
- estados loading, success, error e link inválido/expirado;
- não autenticar automaticamente após reset, salvo decisão explícita posterior;
- após sucesso, oferecer retorno claro ao login;
- E2E com API mockada para não depender de serviço de e-mail real.

## Fluxo 1 — Solicitar recuperação
1. Usuário abre `/esqueci-senha`.
2. Informa e-mail.
3. Frontend chama `POST /api/auth/password/forgot`.
4. Independentemente de existir conta, a UI mostra a mesma confirmação genérica fornecida pelo contrato.
5. A UI não indica “e-mail não cadastrado”.

## Fluxo 2 — Redefinir
1. Usuário chega em `/redefinir-senha?userId=...&token=...`.
2. Informa nova senha e confirmação.
3. Frontend valida apenas requisitos que também existem no backend; não inventar política divergente.
4. Envia `POST /api/auth/password/reset`.
5. Em sucesso, mostra confirmação e CTA para entrar.
6. Token inválido/expirado mostra mensagem clara e CTA para pedir novo link.

## Critérios de aceitação
1. Login possui link de recuperação acessível por teclado.
2. `/esqueci-senha` funciona em 320/390/768/1024/1440 sem overflow horizontal.
3. Mensagem após solicitação não revela se o e-mail existe.
4. Botão de envio possui estado de processamento sem dupla submissão.
5. `/redefinir-senha` rejeita localmente senhas divergentes antes da chamada de API.
6. Token/userId ausentes mostram estado inválido e não tentam reset.
7. Reset bem-sucedido oferece navegação para `/login`.
8. Token expirado/inválido oferece solicitar novo link.
9. Nenhum token é salvo em `localStorage`, `sessionStorage` ou cookie do frontend.
10. Token não é enviado a analytics/log manual adicionado por esta feature.
11. Dark mode, foco visível, labels/nome acessível e reduced motion são preservados.
12. E2E cobre solicitação genérica, reset bem-sucedido e token inválido com API mockada.
13. `npm run verify` permanece verde.

## Visual
Reutilizar a linguagem visual da autenticação atual, sem criar uma terceira identidade. O fluxo deve parecer parte do login/cadastro e priorizar clareza sobre efeitos decorativos.

## Arquivos/áreas prováveis
- `servico-palavra/apps/web/src/components/auth/LoginForm.tsx`
- novas páginas em `src/app/esqueci-senha` e `src/app/redefinir-senha`
- novos componentes em `src/components/auth/`
- `src/lib/auth.ts` ou service dedicado
- `src/types/auth.ts`
- testes Playwright

## Fora de escopo
- confirmação de e-mail;
- MFA;
- recuperação por SMS/WhatsApp;
- gerenciamento de senha dentro do perfil autenticado;
- provedor de e-mail no frontend.

## Definition of Done
- backend E1-BE-01 disponível no contrato esperado;
- critérios 1–13 atendidos;
- `npm run verify` verde;
- story em `review` e code review independente aprovado.
