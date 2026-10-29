# Story E4-FE-01 — Design system v2 e interação visual consistente

Status: in-progress  
Prioridade: P1

## Objetivo
Consolidar a identidade visual já existente do Serviço da Palavra em uma fundação reutilizável, responsiva e acessível, sem redesenhar a marca e sem adicionar biblioteca/serviço pago.

## Diagnóstico
A aplicação já possui uma linguagem visual reconhecível (azul, amarelo, superfícies claras, cards arredondados e microinterações), mas parte relevante está espalhada entre:
- hex codes repetidos em componentes;
- valores de radius/sombra/padding sem padrão central;
- hover com `transform` aplicado sem política global de reduced motion;
- foco de teclado inconsistente;
- cards com padding fixo grande no mobile;
- componentes-base ainda não concentram estados pressed/loading/focus;
- CSS global mistura tokens, shell, autenticação e páginas específicas.

## Estratégia
1. Expandir tokens CSS sem trocar a identidade atual.
2. Tornar `Button`, `LinkButton` e `Card` referências de espaçamento, foco e motion.
3. Padronizar superfícies, bordas, sombras, radius e cores sem migrar tudo de uma vez.
4. Criar uma política global de `prefers-reduced-motion` para animações/microinterações próprias.
5. Garantir alvos interativos mínimos e estados `focus-visible` consistentes.
6. Evitar dependência visual nova; Tailwind/CSS atual continuam suficientes.

## Critérios de aceitação
1. Tokens semânticos existem para brand, superfícies, texto, borda, foco, radius, sombra e motion.
2. `Button`/`LinkButton` têm alvo mínimo de 44px, foco visível, estado active e reduced-motion seguro.
3. `Card` usa padding responsivo, mantendo densidade adequada em 320/390px.
4. Navegação lateral/mobile recebe foco visível coerente com os componentes-base.
5. Animações decorativas próprias são desativadas/reduzidas com `prefers-reduced-motion: reduce`.
6. Dark mode continua legível e sem regressão de contraste óbvia nos componentes tocados.
7. Nenhuma dependência npm ou serviço externo novo é necessário.
8. `npm run typecheck`, lint, build e E2E permanecem verdes.

## Fora de escopo
- redesign completo da marca;
- trocar Tailwind;
- migrar todos os hex codes do projeto em uma única story;
- Figma obrigatório antes de melhorias incrementais;
- refatoração estrutural de todas as páginas.

## Definition of Done
- fundação implementada em CSS/componentes base;
- telas existentes preservam identidade;
- CI verde;
- review independente aprovado.
