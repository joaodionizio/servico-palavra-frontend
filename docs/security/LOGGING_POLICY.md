# Logging Policy

Data: 2026-06-11

## Status

Logging backend não é verificável neste repositório.

## Nunca Registrar

- Senha.
- Hash de senha.
- Token de sessão.
- Cookie.
- Refresh token.
- Connection string.
- Secrets.
- Chaves privadas.
- Payload sensível completo.
- Dados pessoais desnecessários.
- Stack trace para usuário final.

## Eventos de Segurança Que Devem Ser Registrados

- Login bem-sucedido.
- Login inválido.
- Lockout.
- Logout.
- Acesso negado.
- Tentativa de acesso admin indevido.
- Alteração de plano bíblico.
- Reinício/continuidade de plano.
- Mudança de role por admin.
- Criação/edição/publicação/despublicação de conteúdo.
- Falhas críticas com correlation ID.

## Redução de PII

- Mascarar e-mail quando possível.
- Registrar IDs internos apenas quando necessário.
- Usar correlation ID.
- Separar mensagem pública de erro técnico.
- Não logar bodies de login/cadastro.

## Testes Necessários

- Falha de login não registra senha.
- Erro 500 não retorna stack trace ao usuário.
- Acesso negado registra evento sem payload sensível.
- Alteração de plano registra usuário autenticado e plano afetado sem expor leituras privadas desnecessárias.
