# Documentacao das Mudancas de Seguranca

Este documento explica, em linguagem simples, o que foi alterado no projeto, por que essas mudancas foram feitas e o que foi ajustado no banco de dados Supabase.

O objetivo principal foi deixar o aplicativo mais seguro sem alterar a aparencia do site, as telas, as cores ou as animacoes.

## Resumo Geral

Antes das mudancas, o aplicativo funcionava, mas dependia muito de verificacoes feitas no navegador do usuario. Isso e perigoso porque qualquer pessoa pode tentar conversar diretamente com a API do Supabase, sem passar pelas telas do site.

Depois das mudancas, a seguranca mais importante passou a ficar no lugar certo: o banco de dados.

Em resumo:

- O frontend continua responsavel pela experiencia do usuario.
- O Supabase agora controla quem pode ler ou alterar dados.
- Usuarios comuns so podem acessar os proprios dados.
- Admins podem acessar os dados gerais.
- Chaves secretas continuam fora do GitHub.
- O projeto agora tem comandos mais faceis de rodar pela raiz.
- As dependencias foram auditadas e ficaram sem vulnerabilidades conhecidas no `npm audit`.

## O Que Foi Mudado no Projeto

### 1. Scripts na raiz do projeto

Arquivo alterado:

- `package.json`

Antes, se voce rodasse:

```bash
npm run dev
```

na raiz do repositorio, dava erro, porque o app Next.js fica dentro da pasta `app-plano-biblico`.

Agora a raiz encaminha os comandos para a pasta correta.

Foram adicionados:

```json
"dev": "npm --prefix app-plano-biblico run dev",
"build": "npm --prefix app-plano-biblico run build",
"start": "npm --prefix app-plano-biblico run start",
"lint": "npm --prefix app-plano-biblico run lint"
```

Com isso, voce pode rodar da raiz:

```bash
npm run dev
npm run build
npm run lint
```

### 2. Variaveis do Supabase foram validadas

Arquivos alterados/criados:

- `app-plano-biblico/app/lib/env.ts`
- `app-plano-biblico/app/lib/supabaseClient.ts`
- `app-plano-biblico/.env.example`
- `.env.example`

O app precisa destas duas variaveis para conectar no Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Agora, se elas nao existirem, o app mostra um erro claro dizendo exatamente o que falta.

Isso evita erro confuso e ajuda a identificar rapidamente problema de configuracao.

Importante:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` e uma chave publica do Supabase.
- Ela pode aparecer no frontend.
- Mesmo sendo publica, ela so e segura se o banco tiver RLS e policies corretas.
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ir para o frontend.

### 3. Arquivos de exemplo de ambiente

Arquivos criados:

- `.env.example`
- `app-plano-biblico/.env.example`

Esses arquivos servem como modelo.

Eles mostram quais variaveis precisam existir, mas nao guardam os valores reais.

O arquivo real local e:

```bash
app-plano-biblico/.env.local
```

Esse arquivo fica ignorado pelo Git e nao deve ser enviado para o GitHub.

### 4. `.gitignore` foi ajustado

Arquivos alterados:

- `.gitignore`
- `app-plano-biblico/.gitignore`

O objetivo foi garantir duas coisas:

1. Arquivos reais de segredo continuam fora do Git.
2. Arquivos `.env.example` podem ser versionados, porque nao contem segredo real.

Foi mantido o cuidado para nao enviar:

- `.env`
- `.env.local`
- `.env.production`
- chaves privadas
- arquivos gerados
- `node_modules`
- `.next`

### 5. Configuracao de seguranca do Next.js

Arquivo alterado:

- `app-plano-biblico/next.config.ts`

Foram adicionados headers de seguranca.

Headers sao instrucoes que o navegador recebe junto com o site. Eles ajudam a diminuir riscos como:

- site ser aberto dentro de iframe malicioso;
- navegador interpretar arquivos de forma errada;
- vazamento desnecessario de informacoes de origem;
- uso indevido de camera, microfone, geolocalizacao ou pagamento;
- carregamento de recursos externos nao planejados.

Foram adicionados:

- `Content-Security-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`
- `Strict-Transport-Security`

A politica permite conexao com:

```text
https://*.supabase.co
wss://*.supabase.co
```

Isso e necessario porque o app conversa com o Supabase.

Em desenvolvimento, tambem foi liberado o minimo necessario para o Next funcionar localmente com hot reload.

### 6. Raiz correta do Turbopack

Arquivo alterado:

- `app-plano-biblico/next.config.ts`

O Next estava avisando que encontrou mais de um `package-lock.json` e poderia escolher a raiz errada do projeto.

Foi configurado:

```ts
turbopack: {
  root: process.cwd(),
}
```

Isso ajuda o Next a entender que a raiz do app e `app-plano-biblico` quando ele esta rodando ali.

### 7. Remocao de dependencia de Google Fonts no build

Arquivo alterado:

- `app-plano-biblico/app/layout.tsx`

Antes o app usava `next/font/google`.

Isso fazia o build tentar acessar o Google Fonts. Em ambiente sem internet ou com rede bloqueada, o build quebrava.

Foi removida essa dependencia externa.

O CSS ja usava fontes comuns do sistema:

```css
font-family: Arial, Helvetica, sans-serif;
```

Assim, o visual continua muito parecido e o build fica mais previsivel.

### 8. Ajustes de lint nos componentes

Arquivos alterados:

- `app-plano-biblico/app/admin/page.tsx`
- `app-plano-biblico/app/admin/usuarios/[id]/page.tsx`
- `app-plano-biblico/app/app/layout.tsx`
- `app-plano-biblico/app/app/page.tsx`
- `app-plano-biblico/app/app/perfil/page.tsx`
- `app-plano-biblico/app/app/plano/page.tsx`
- `app-plano-biblico/app/app/introducao/page.tsx`

O lint apontava problemas com funcoes usadas dentro de `useEffect`.

Foram feitos ajustes com `useCallback` e chamadas assincronas para deixar o codigo mais estavel e passar nas regras atuais do React/Next.

Essas mudancas nao foram feitas para alterar o visual.

Elas servem para:

- remover erros de lint;
- evitar comportamento instavel;
- deixar o build mais confiavel;
- facilitar manutencao futura.

### 9. Link de Admin so aparece para admin

Arquivo alterado:

- `app-plano-biblico/app/app/layout.tsx`

Antes, o link `Admin` aparecia para todo usuario logado.

Agora ele so aparece se o usuario tiver:

```text
role = admin
```

Isso nao e a seguranca principal. A seguranca principal esta no banco.

Mas melhora a experiencia porque usuario comum nao ve uma area que nao pode acessar.

### 10. Vulnerabilidade do PostCSS corrigida

Arquivos alterados:

- `app-plano-biblico/package.json`
- `app-plano-biblico/package-lock.json`

O `npm audit` encontrou uma vulnerabilidade moderada no `postcss` usado indiretamente pelo Next.

Foi adicionado um `overrides`:

```json
"overrides": {
  "postcss": "8.5.13"
}
```

Isso obriga o projeto a usar uma versao segura do `postcss`.

Depois disso:

```bash
npm audit
```

passou com 0 vulnerabilidades conhecidas.

### 11. Script de seed ficou mais seguro

Arquivo alterado:

- `seed-plano-leitura.js`

Esse script usa `SUPABASE_SERVICE_ROLE_KEY`.

Essa chave e muito poderosa. Ela ignora RLS e consegue alterar dados diretamente.

Antes, o script apagava a tabela `plano_leitura_dias` e recriava os dados.

Agora ele exige uma confirmacao explicita:

```env
CONFIRM_SEED_PLANO_LEITURA=SIM_APAGAR_E_RECRIAR_PLANO
```

Sem isso, o script para e nao apaga nada.

Isso reduz o risco de rodar o seed sem querer contra o banco errado.

## O Que Foi Mudado no Banco Supabase

Arquivo criado no projeto:

- `supabase/security-policies.sql`

Esse arquivo contem o SQL que foi aplicado no Supabase.

Ele e a parte mais importante da seguranca.

### 1. RLS foi ativado nas tabelas

Foi ativado RLS em:

```sql
public.usuarios
public.progresso_leitura
public.plano_leitura_dias
```

RLS significa Row Level Security.

Em linguagem simples:

> O banco passa a decidir linha por linha o que cada usuario pode ver ou alterar.

Isso e essencial porque a chave anonima do Supabase e publica no frontend.

Sem RLS, alguem poderia tentar acessar dados diretamente pela API do Supabase.

### 2. Acesso anonimo foi removido das tabelas

Foi feito:

```sql
revoke all from anon;
```

para as tabelas principais.

Isso significa:

- usuario deslogado nao le usuarios;
- usuario deslogado nao le progresso;
- usuario deslogado nao altera dados;
- usuario deslogado nao acessa plano pelo banco.

O app exige login.

### 3. Usuarios autenticados receberam permissoes basicas

Foi liberado para `authenticated`:

- ler dados permitidos pelas policies;
- criar perfil proprio;
- ler plano de leitura;
- criar/atualizar/deletar o proprio progresso.

Mas essas permissoes so funcionam junto com as policies.

Ou seja: nao basta estar logado. A linha tambem precisa passar na regra de seguranca.

### 4. Usuario comum nao pode atualizar `role`

Foi feito:

```sql
revoke update on public.usuarios from authenticated;
grant update (nome, email) on public.usuarios to authenticated;
```

Isso permite que o usuario altere apenas:

- `nome`
- `email`

E impede que ele tente alterar:

- `role`
- `sequencia_atual`
- `ultimo_dia_lido`
- outros campos sensiveis

Isso evita um ataque simples:

> usuario comum tentar mudar o proprio role para admin.

### 5. Funcao `is_admin()`

Foi criada a funcao:

```sql
public.is_admin()
```

Ela verifica se o usuario logado tem:

```text
role = admin
```

Essa funcao e usada nas policies para permitir que admins vejam dados gerais.

### 6. Policy da tabela `usuarios`

Foi criada a policy:

```sql
usuarios_select_own_or_admin
```

Ela permite:

- usuario comum ver apenas o proprio cadastro;
- admin ver todos os usuarios.

Tambem foi criada:

```sql
usuarios_insert_own_user_profile
```

Ela permite que um usuario crie apenas o proprio perfil.

E:

```sql
usuarios_update_own_basic_fields
```

Ela permite atualizar apenas a propria linha, respeitando as permissoes de coluna.

### 7. Policy da tabela `plano_leitura_dias`

Foi criada:

```sql
plano_leitura_select_authenticated
```

Ela permite que qualquer usuario logado leia o plano de leitura.

Isso faz sentido porque o plano em si nao e privado.

### 8. Policies da tabela `progresso_leitura`

Foram criadas policies para:

- select;
- insert;
- update;
- delete.

As regras principais sao:

```text
usuario_id = auth.uid()
```

Isso significa:

> O usuario so pode mexer no progresso que pertence ao proprio usuario.

Admin pode ler progresso de todos, mas usuario comum nao.

### 9. Funcao `atualizar_sequencia_usuario`

Foi recriada a funcao:

```sql
public.atualizar_sequencia_usuario(...)
```

Antes, se a funcao aceitasse qualquer `p_usuario_id` sem verificar, alguem poderia tentar atualizar a sequencia de outro usuario.

Agora a funcao verifica:

```sql
if p_usuario_id <> auth.uid() then
  raise exception
end if;
```

Em linguagem simples:

> Voce so pode atualizar a sua propria sequencia.

## O Que Precisa Ser Conferido Depois

### 1. Conta admin

Confira se seu usuario admin continua com:

```text
role = admin
```

na tabela `usuarios`.

Se nao tiver, o app vai redirecionar esse usuario para `/app` em vez de abrir `/admin`.

### 2. Cadastro de novos usuarios

O cadastro usa:

```ts
supabase.auth.signUp(...)
```

Isso cria o usuario no Auth.

Mas o app tambem espera uma linha na tabela:

```text
public.usuarios
```

Se o banco ja tiver trigger criando essa linha automaticamente, esta tudo certo.

Se nao tiver, usuarios novos podem conseguir criar conta, mas depois aparecer como "Usuario nao encontrado".

Nesse caso, precisa criar um trigger no Supabase para inserir em `public.usuarios` quando um novo usuario entra em `auth.users`.

### 3. Variaveis no deploy

No ambiente de producao, configure:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

No Vercel ou outro deploy, essas variaveis precisam existir.

Sem elas, o app nao sobe.

### 4. Service role

A chave:

```env
SUPABASE_SERVICE_ROLE_KEY
```

nao deve ficar no frontend.

Ela so deve ser usada em:

- maquina local;
- CI seguro;
- scripts administrativos;
- ambiente backend privado.

## Como Validar

Foram executados:

```bash
npm run lint
npm run build
npm audit
```

Resultados:

- lint passou;
- build passou;
- audit da raiz passou com 0 vulnerabilidades;
- audit do app passou com 0 vulnerabilidades.

## O Que Nao Foi Alterado

Nao houve intencao de mudar:

- layout das paginas;
- cores;
- animacoes;
- textos principais de tela;
- estrutura visual dos cards;
- fluxo visual do usuario.

A unica mudanca visivel esperada e:

- o link `Admin` so aparece para usuarios admin.

Isso foi feito por seguranca e organizacao da interface.

## Conclusao

As mudancas deixam o projeto mais seguro porque movem a protecao principal para o banco de dados, que e onde ela precisa estar.

O frontend pode esconder botoes e redirecionar paginas, mas isso sozinho nao protege contra ataques.

A protecao real agora vem de:

- RLS ativado;
- policies por usuario;
- bloqueio de update em campos sensiveis;
- funcao de admin controlada;
- RPC validando `auth.uid()`;
- chaves privadas fora do frontend;
- headers de seguranca no Next.js;
- dependencias auditadas.

