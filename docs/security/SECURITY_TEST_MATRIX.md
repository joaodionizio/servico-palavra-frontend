# Security Test Matrix

Data: 2026-06-11

## Status

Testes automatizados de backend não foram criados neste repositório porque o backend está em outro repo.

## Matriz Obrigatória Para o Backend

| Área | Teste | Persona | Resultado esperado |
|------|-------|---------|--------------------|
| Auth | login válido | UsuarioA | 200 e cookie HttpOnly |
| Auth | login inválido | UsuarioA | 401 genérico |
| Auth | usuário inexistente | Anônimo | 401 genérico |
| Auth | rate limit login | Anônimo | 429 |
| Auth | lockout | UsuarioA | bloqueio temporário |
| Auth | logout | UsuarioA | cookie invalidado |
| Privado | rota protegida sem auth | Anônimo | 401 |
| Admin | endpoint admin anônimo | Anônimo | 401 |
| Admin | endpoint admin usuário comum | UsuarioA | 403 |
| Admin | endpoint admin admin | Admin | 200 |
| Roles | role no payload | UsuarioA | ignorado |
| Conteúdos | rascunho para usuário comum | UsuarioA | não listado |
| Conteúdos | rascunho para admin | Admin | listado |
| Conteúdos | URL `javascript:` | Admin | rejeitada |
| Conteúdos | iframe arbitrário | Admin | rejeitado |
| Favoritos | A remove favorito de B | UsuarioA | 404/403 |
| Favoritos | duplicidade | UsuarioA | bloqueada |
| Progresso | A conclui conteúdo por B | UsuarioA | 404/403 |
| Plano | A lê plano de B | UsuarioA | 404/403 |
| Plano | A altera plano de B | UsuarioA | 404/403 |
| Plano | A conclui dia de B | UsuarioA | 404/403 |
| Plano | continuidade | UsuarioA | começa em última ordem + 1 |
| Plano | reinício | UsuarioA | começa na primeira ordem |
| Plano | manipular ordem | UsuarioA | rejeitado |
| Plano | troca com falha | UsuarioA | rollback |
| Plano | dois ativos | UsuarioA | constraint bloqueia |
| CSRF | POST sem token | UsuarioA | 400/403 |
| CSRF | POST com token | UsuarioA | sucesso |
| CORS | origem permitida | Browser | permitido |
| CORS | origem indevida | Browser | bloqueado |
| Erros | exceção interna | UsuarioA | sem stack trace |

## Frontend V2

Verificações esperadas:

- Build passa.
- `localStorage` não é usado para token.
- Headers de segurança presentes.
- Não há `dangerouslySetInnerHTML`.
- Não há secrets `NEXT_PUBLIC_` além de API URL pública.
