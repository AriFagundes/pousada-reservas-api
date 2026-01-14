# Setup do Backend no Render

## Variáveis de Ambiente Necessárias

Após fazer o deploy no Render, você precisa configurar as seguintes variáveis de ambiente no dashboard:

### 1. **FRONTEND_URL** ⭐ IMPORTANTE
- **Chave:** `FRONTEND_URL`
- **Valor:** `https://clientes.greatic.io` (ou seu domínio do frontend)
- **Descrição:** URL base do frontend, usada nos links dos emails

### 2. **JWT_SECRET**
- **Chave:** `JWT_SECRET`
- **Valor:** Gere uma string aleatória e segura (ex: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- **Descrição:** Chave secreta para assinar tokens JWT

### 3. **DATABASE_URL**
- Já configurada automaticamente pelo render.yaml
- Conecta ao banco de dados PostgreSQL

## Como Adicionar no Render

1. Acesse o dashboard do Render
2. Vá para seu serviço `pousada-reservas-api`
3. Clique em **Settings**
4. Procure por **Environment**
5. Clique em **Add Environment Variable**
6. Preencha os campos:
   - Name: `FRONTEND_URL`
   - Value: `https://clientes.greatic.io`
7. Clique em **Save Changes**
8. Repita para `JWT_SECRET`

## Resultado Esperado

✅ Emails de verificação com links corretos para o frontend
✅ Autenticação JWT funcionando
✅ Tokens de verificação com 24h de expiração
✅ Senhas com hash bcrypt

## Troubleshooting

### Emails não enviados
- Verifique se `FRONTEND_URL` está configurada
- Verifique nos logs do Render se há erros de Resend
- Confirme se a chave de API do Resend é válida

### Links nos emails quebrados
- Confirme se `FRONTEND_URL` é acessível publicamente
- Use HTTPS para produção

### Erros de autenticação
- Verifique se `JWT_SECRET` está configurada
- Limpe localStorage e tente novamente
