#!/bin/bash

# Script de Setup do Dashboard

echo "🏨 Iniciando setup do Dashboard de Reservas..."
echo ""

# 1. Atualizar Prisma
echo "📦 Atualizando Prisma..."
cd pousada-reservas-api
npx prisma generate

# 2. Executar migração
echo "🗄️ Executando migração do banco..."
npx prisma migrate dev --name add_dashboard_features

# 3. Verificar schema
echo "✅ Verificar o arquivo prisma/schema.prisma"
echo ""

# 4. Criar dados iniciais de configuração (opcional)
echo "📝 Considere criar configurações iniciais de pousadas"
echo "   Você pode usar: npx prisma db push"
echo ""

echo "✨ Setup completo!"
echo ""
echo "Próximos passos:"
echo "1. npm run dev (neste diretório)"
echo "2. cd ../frontend-pousada && npm run dev"
echo "3. Acesse http://localhost:5173/pousada"
echo ""
echo "🎯 Navegue até /dashboard para ver o novo sistema!"
