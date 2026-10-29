---
name: bmad-code-review
description: Revisa adversarialmente uma story implementada no frontend, sem corrigir automaticamente e sem marcar done por conta própria.
---

# BMad Code Review — Serviço da Palavra

## Objetivo
Revisar como contexto independente depois de build + verify, procurando regressões funcionais, problemas de UX/acessibilidade, contratos frágeis e lacunas de teste.

## Contexto
Leia:
1. story e critérios de aceitação;
2. diff/arquivos alterados;
3. documentação e contrato com backend;
4. resultados de verificação registrados.

## Checklist
- Todos os critérios foram atendidos de fato?
- Há estados loading/error/empty coerentes?
- Há requisições redundantes ou delays artificiais?
- Sessão, CSRF e 401 continuam corretos?
- Há overflow/layout quebrado em 320/390/768/1024/1440?
- Navegação por teclado, foco, aria e modal/menu estão corretos?
- Dark mode e reduced motion foram preservados?
- Componentes/tokens existentes foram reutilizados?
- Há cobertura automatizada suficiente?
- A mudança adicionou CSS/normalização/complexidade desnecessária?

## Severidade
Classifique como `CRITICAL`, `HIGH`, `MEDIUM` ou `LOW`, sempre com evidência e impacto.

## Resultado
- `APPROVED`
- `CHANGES_REQUESTED`
- `BLOCKED`

A story permanece em `review` durante a análise e só vai para `done` após aprovação do fluxo/usuário.

## Restrições
- Não corrija automaticamente durante review sem pedido explícito.
- Não faça commit, push, merge ou branch.
- Diferencie bug real de melhoria opcional.
- Não invente achados.