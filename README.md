# Pousada Reservas API

API de reservas para hotéis e pousadas com suporte multi-tenant.

## 🚀 Deploy

### Variáveis de Ambiente Necessárias

```
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
PORT=3000
FRONTEND_URL=https://clientes.greatic.io
JWT_SECRET=sua_chave_secreta
```

### Comandos de Deploy

```bash
# 1. Instalar dependências
npm install

# 2. Gerar Prisma Client
npx prisma generate

# 3. Rodar migrations
npx prisma migrate deploy

# 4. Iniciar servidor
npm start
```

## 📝 Endpoints

- `/hoteis` - Gerenciamento de hotéis
- `/tipos-quarto` - Tipos de quartos
- `/quartos` - Quartos e disponibilidade
- `/clientes` - Cadastro de clientes
- `/reservas` - Sistema de reservas

## 🔧 Desenvolvimento

```bash
npm run dev
```
