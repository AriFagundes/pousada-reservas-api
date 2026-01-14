const axios = require('axios');

const API_URL = 'https://pousada-reservas-api.onrender.com';

async function testarReserva() {
  try {
    console.log('🧪 Testando criação de reserva...\n');

    const response = await axios.post(`${API_URL}/reservas/criar-reserva`, {
      hotelId: 'solar-penha',
      tipoQuartoId: 'suite-master-luxo',
      dataCheckIn: '2026-01-20',
      dataCheckOut: '2026-01-25',
      numeroPessoas: 2,
      clienteNome: 'João Teste',
      clienteEmail: 'joao@teste.com',
      clienteTelefone: '(11) 98765-4321'
    });

    console.log('✅ Sucesso!\n');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Erro:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testarReserva();
