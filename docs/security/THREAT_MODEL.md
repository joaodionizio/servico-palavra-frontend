# Threat Model

Data: 2026-06-11

Metodologia: STRIDE simplificado.

Escopo: frontend V2 presente neste repositório e backend esperado em repositório separado. Quando a mitigação depende do backend, o status é marcado como necessário.

| Área | Ativo protegido | Ameaça | STRIDE | Impacto | Prob. | Sev. | Mitigação existente | Mitigação necessária | Teste necessário |
|------|-----------------|--------|--------|---------|-------|------|---------------------|----------------------|------------------|
| Login | Conta do usuário | Enumeração e brute force | S/I | Acesso indevido | Alta | HIGH | Mensagem genérica no frontend | Identity lockout, rate limit, logs seguros | Login inválido, lockout, rate limit |
| Cadastro | Conta | Abuso de criação | D/E | Spam e abuso | Média | MEDIUM | Form básico | Rate limit, validação server-side, e-mail futuro | Cadastro em massa |
| Recuperação senha | Conta | Reset indevido | S/T | Tomada de conta | Média | HIGH | Não implementado | Identity tokens, resposta genérica, rate limit | Fluxo reset |
| Sessão | Cookie auth | Roubo/fixação de sessão | S/E | Acesso indevido | Média | HIGH | Front não usa localStorage | Cookie HttpOnly Secure SameSite, security stamp | Verificar cookies |
| Cookies | Sessão | Cookie inseguro | S/I | Exposição de sessão | Média | HIGH | Não verificável | Configurar no backend | Browser devtools/manual |
| Endpoints privados | Dados do usuário | Acesso sem auth | E/I | Vazamento | Alta | CRITICAL | AuthGate UX | `[Authorize]` backend | 401 anônimo |
| Endpoints admin | Dados administrativos | Usuário comum acessa admin | E | Vazamento/alteração | Alta | CRITICAL | Link admin visível no shell | Role-based auth backend | 403 usuário comum |
| Conteúdos | Conteúdo publicado/não publicado | Conteúdo privado aparece | I | Vazamento | Média | HIGH | Mocks apenas | Filtro backend por publicação/role | Conteúdo rascunho |
| Favoritos | Preferências usuário | Acesso cruzado por ID | I/T | Vazamento/alteração | Alta | CRITICAL | Não verificável | Derivar UserId da sessão | UsuarioA x UsuarioB |
| Progresso | Histórico usuário | Concluir por outro usuário | T | Corrupção de dados | Alta | CRITICAL | Não verificável | Ownership backend | Concluir recurso alheio |
| Trilhas | Progresso trilha | Manipulação de progresso | T | Dados incorretos | Média | HIGH | Não verificável | Ownership e cálculos server-side | Progresso cruzado |
| Plano bíblico | Plano ativo | Alterar plano alheio | T/I | Quebra privacidade | Alta | CRITICAL | UI apenas | Ownership, transações | Alterar plano de B |
| Histórico planos | Histórico espiritual | Vazamento histórico | I | Privacidade | Alta | CRITICAL | Não verificável | Query por usuário autenticado | GET histórico alheio |
| Continuidade plano | Posição pastoral | Pular/manipular ordem | T | Estado inconsistente | Média | HIGH | UI destaca opção | Backend ignora payload sensível | Payload adulterado |
| Alteração duração | Plano | Duração inválida | T/D | Estado ruim | Média | MEDIUM | UI opções | Validação backend | Duração fora da whitelist |
| Recomeço plano | Plano | Apagar histórico indevido | T/R | Perda dados | Média | HIGH | UI separada | Transação e histórico preservado | Reinício preserva histórico |
| Dashboard | Dados agregados | Exposição de dados de outro usuário | I | Vazamento | Alta | CRITICAL | Mocks | `/me`, ownership em consultas | Dashboard A não mostra B |
| Google Drive | Materiais | Link privado exposto | I | Vazamento | Média | HIGH | CSP permite Drive | Validação/allowlist backend; permissões Drive | URL maliciosa/privada |
| YouTube | Vídeos | Iframe arbitrário | XSS/I | Execução/track | Média | MEDIUM | CSP frame-src restrito | Validar domínio e videoId backend | URL iframe indevida |
| Logs | PII/sessão | Token/senha em log | I/R | Vazamento | Média | HIGH | Não há logging frontend sensível | Política backend | Inspecionar logs |
| Deploy | App publicado | Config insegura | E/I | Vazamento | Média | HIGH | Headers Next | Variáveis por ambiente; HTTPS | Checklist deploy |
| Banco remoto | Dados | Acesso/backup inseguro | I/T | Vazamento | Média | HIGH | Não verificável | Neon com secrets fora do repo | Testar conexão/roles |
| SQLite local | Dados dev | Usado em prod Render | I/D | Perda/vazamento | Média | HIGH | Não aplicável no front | Backend deve bloquear SQLite prod | DATABASE_PROVIDER prod |
| Variáveis ambiente | Segredos | `NEXT_PUBLIC_` com segredo | I | Exposição bundle | Média | HIGH | V2 só usa API URL pública | Revisão CI | Grep env |
| Migrations | Banco | Schema inseguro | T/D | Integridade | Média | HIGH | Não verificável | Constraints, FK, índices | Testes migrations |
| Seed admin | Admin | Senha padrão em prod | E | Tomada admin | Média | CRITICAL | Não verificável | Bootstrap seguro | Ambiente prod sem seed padrão |

## Observações

- A ameaça dominante é IDOR/authorization bypass. Nenhum controle de frontend resolve isso.
- O backend deve negar por padrão, derivar usuário da sessão e nunca aceitar `UsuarioId`, `Role` ou `PerfilId` do cliente para decisões de acesso.
