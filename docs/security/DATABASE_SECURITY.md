# Database Security

Data: 2026-06-11

## Status

Não verificável neste repositório. O backend e suas migrations foram movidos para outro repositório.

## Requisitos Obrigatórios Para o Backend

- Desenvolvimento local: SQLite apenas para dev.
- Produção: PostgreSQL remoto persistente, inicialmente Neon Free.
- EF Core provider de produção: `Npgsql.EntityFrameworkCore.PostgreSQL`.
- Seleção por variável:
  - `DATABASE_PROVIDER=sqlite`
  - `DATABASE_PROVIDER=postgresql`
  - `CONNECTION_STRING` fora do repositório.

## Bloqueios de Produção

- O backend deve falhar ao iniciar em `Production` se `DATABASE_PROVIDER=sqlite`.
- Connection string não pode ser versionada.
- Migrations devem ser revisadas.
- Dados históricos de plano bíblico não devem ter cascade delete acidental.
- Troca de plano bíblico deve ocorrer em transação.

## Constraints Recomendadas

- Usuário:
  - e-mail único normalizado.
  - role gerenciada pelo Identity.
- Favoritos:
  - índice único `(UsuarioId, ConteudoId)`.
- Progresso:
  - índice único para evitar duplicidade por usuário/conteúdo.
- Plano bíblico:
  - no máximo um plano ativo por usuário.
  - FK de dias para plano do mesmo usuário.
  - histórico preservado.
- Conteúdos:
  - slug único.
  - publicado controlado por admin.

## SQL Seguro

- Preferir LINQ e projections.
- Se usar SQL raw, usar parâmetros.
- Proibir concatenação de input do usuário.
- Limitar paginação.
- Não retornar entidades EF diretamente.

## Testes Necessários

- Production com SQLite deve falhar.
- Production sem connection string deve falhar.
- Transação de troca de plano com falha simulada deve rollback.
- UsuarioA não consulta plano/dias/histórico de UsuarioB.
- Constraints impedem duplicidade de favoritos, progresso e planos ativos.
