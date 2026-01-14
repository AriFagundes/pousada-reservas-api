const axios = require('axios');

const API_URL = 'https://pousada-reservas-api.onrender.com';
const ADMIN_PASSWORD = 'admin123';

async function criarSolarDePenha() {
  try {
    console.log('🏗️  Criando dados do Solar de Penha...\n');

    const response = await axios.post(`${API_URL}/admin/criar-solar-de-penha`, {
      senhaAdmin: ADMIN_PASSWORD
    });

    console.log('✅ Sucesso!\n');
    console.log(`Hotel: ${response.data.hotel.nome}`);
    console.log(`Tipos de quarto: ${response.data.tiposQuarto.length}`);
    console.log(`Quartos criados: ${response.data.quartos.length}`);
    console.log('\n🎉 Solar de Penha pronto para usar!');

  } catch (error) {
    console.error('❌ Erro:', error.response?.data?.error || error.message);
  }
}

criarSolarDePenha();
