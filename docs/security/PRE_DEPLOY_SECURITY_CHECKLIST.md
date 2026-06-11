# Pre-Deploy Security Checklist

Data: 2026-06-11

- [ ] SQLite não é usado como banco persistente no Render Free.
- [ ] PostgreSQL remoto persistente configurado.
- [ ] Connection string fora do repositório.
- [ ] Secrets fora do repositório.
- [ ] Cookies HttpOnly.
- [ ] Cookies Secure em produção.
- [ ] SameSite revisado.
- [ ] CSRF implementado.
- [ ] CORS restritivo.
- [ ] HTTPS obrigatório.
- [ ] HSTS ativo.
- [x] CSP configurada no frontend V2.
- [x] X-Content-Type-Options configurado no frontend V2.
- [x] Referrer-Policy configurada no frontend V2.
- [x] Permissions-Policy configurada no frontend V2.
- [x] Sem token no localStorage no frontend V2.
- [ ] Sem secrets `NEXT_PUBLIC_` no app legado ou legado removido.
- [ ] Sem senha padrão de admin em produção.
- [ ] Swagger revisado para produção.
- [ ] Stack traces ocultos.
- [ ] Logs sem dados sensíveis.
- [ ] Rate limit ativo.
- [ ] Endpoints admin protegidos.
- [ ] Ownership validado.
- [ ] Testes UsuarioA x UsuarioB passando.
- [ ] Migrations revisadas.
- [ ] Dependências auditadas sem vulnerabilidades pendentes.
- [ ] Backup/exportação documentado.
- [ ] Ambiente Production configurado.
- [ ] Google Drive revisado.
- [ ] URLs externas validadas.
- [x] Documentação de segurança inicial criada.

## Bloqueio

Não fazer deploy de produção enquanto os itens backend/ownership/cookies/CSRF/CORS estiverem pendentes.
