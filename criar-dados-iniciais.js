#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'https://pousada-reservas-api.onrender.com';
const SENHA_ADMIN = 'admin123';

async function criarDadosIniciais() {
  try {
    console.log('🏗️  Criando dados iniciais no banco...\n');

    const response = await axios.post(`${API_URL}/admin/criar-dados-iniciais`, {
      senhaAdmin: SENHA_ADMIN
    });

    console.log('✅ Sucesso!\n');
    console.log('Hotel:', response.data.hotel.nome);
    console.log('Tipos de quarto:', response.data.tiposQuarto.length);
    console.log('Quartos criados:', response.data.quartos.length);
    console.log('\n🎉 Agora você pode acessar o dashboard com dados!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Erro:', error.response.data.message);
    } else {
      console.error('❌ Erro de conexão:', error.message);
    }
  }
}

criarDadosIniciais();
