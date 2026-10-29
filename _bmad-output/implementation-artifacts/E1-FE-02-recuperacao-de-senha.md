# Story E1-FE-02 — Fluxo de recuperação de senha

Status: done  
Prioridade: P0  
Dependência: E1-BE-01-recuperacao-de-senha — concluída

## Objetivo
Adicionar um fluxo completo, responsivo e acessível de “Esqueci minha senha” e redefinição de senha integrado ao backend Identity.

## Implementação
- login possui link acessível “Esqueci minha senha”;
- página pública `/esqueci-senha`;
- página pública `/redefinir-senha` com `Suspense` e leitura de `userId`/`token` da URL;
- `requestPasswordReset` e `resetPassword` usam o client HTTP compartilhado e continuam protegidos por CSRF;
- shell de recuperação reutiliza a identidade visual do login;
- estados de loading, sucesso, erro, link ausente e token inválido/expirado;
- reset bem-sucedido não autentica automaticamente;
- token inválido oferece CTA “Solicitar novo link”;
- política de senha foi centralizada no frontend e alinhada ao Identity;
- cadastro deixou de impor máximo de 8 caracteres;
- dark mode e `prefers-reduced-motion` tratados explicitamente nos novos estados/CTAs.

## Fluxo 1 — Solicitar recuperação
1. Usuário abre `/esqueci-senha`.
2. Informa e-mail.
3. Frontend chama `POST /api/auth/password/forgot`.
4. Independentemente de existir conta, a UI mostra a mesma confirmação genérica fornecida pelo contrato.
5. A UI não indica “e-mail não cadastrado”.

## Fluxo 2 — Redefinir
1. Usuário chega em `/redefinir-senha?userId=...&token=...`.
2. Informa nova senha e confirmação.
3. Frontend valida a mesma política funcional do backend.
4. Envia `POST /api/auth/password/reset`.
5. Em sucesso, mostra confirmação e CTA para entrar.
6. Token inválido/expirado mostra mensagem clara e CTA para pedir novo link.

## Critérios de aceitação — resultado
1. Link acessível por teclado — atendido.
2. 320/390/768/1024/1440 sem overflow horizontal — atendido por E2E.
3. Confirmação não enumera conta — atendido.
4. Processamento bloqueia dupla submissão — atendido por E2E.
5. Senhas divergentes bloqueadas antes da API — atendido por E2E.
6. Token/userId ausentes não chamam reset — atendido por E2E.
7. Sucesso oferece `/login` sem auto-login — atendido por E2E.
8. Token inválido/expirado oferece novo link — atendido por E2E.
9. Token não vai para localStorage/sessionStorage/cookie — atendido por E2E.
10. Nenhum analytics/log manual com token foi adicionado — atendido.
11. Dark mode, labels, foco e reduced motion preservados — atendido.
12. Suíte E2E cobre todos os fluxos definidos — atendido.
13. `Frontend Verify` permanece verde — atendido.

## E2E
A suíte mocka apenas `/mock-api/**`, sem depender de Render/Neon, e verifica:
- acesso por teclado ao fluxo;
- confirmação genérica;
- botão desabilitado durante request;
- reset válido sem auto-login;
- token não persistido em storage/cookie;
- token inválido com CTA de novo link;
- link sem parâmetros;
- senhas divergentes sem chamada de API;
- reduced motion/dark mode;
- ausência de overflow em cinco viewports.

## Arquivos alterados
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/RecoveryAuthShell.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`
- `src/components/auth/ResetPasswordForm.tsx`
- `src/app/esqueci-senha/page.tsx`
- `src/app/redefinir-senha/page.tsx`
- `src/lib/auth.ts`
- `src/lib/passwordPolicy.ts`
- `src/types/auth.ts`
- `tests/e2e/smoke.spec.ts`

## Verificação final
`Frontend Verify` run `40973997486` concluído com `success` sobre a árvore final. Passaram: audit de produção, type-check, lint, build, autenticação, solicitação de recuperação, reset válido, token inválido, parâmetros ausentes, senhas divergentes, segurança/reduced motion e responsividade.

## Review
Resultado: **APPROVED**.

Não há achados bloqueantes. Os últimos falsos negativos estavam nos seletores do Playwright: labels parcialmente coincidentes e o `role="alert"` interno do Next.js. Os testes foram tornados específicos sem reduzir a cobertura funcional.

## Fora de escopo
- confirmação de e-mail;
- MFA;
- recuperação por SMS/WhatsApp;
- gerenciamento de senha dentro do perfil autenticado;
- provedor de e-mail no frontend.

## Definition of Done
- backend E1-BE-01 concluído;
- critérios 1–13 atendidos;
- CI final verde;
- review independente aprovado.
