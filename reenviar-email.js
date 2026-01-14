#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'https://pousada-reservas-api.onrender.com';
const EMAIL = 'aricontato1@gmail.com'; // Mude para seu email real
const SENHA_ADMIN = 'admin123';

async function reenviarEmail() {
  try {
    console.log(`📧 Reenviando email para ${EMAIL}...\n`);

    const response = await axios.post(`${API_URL}/auth/reenviar-email`, {
      email: EMAIL
    });

    console.log('✅', response.data.message);
    console.log('\n📬 Verifique seu email (incluindo spam)!');
    console.log('⚠️  Atenção: O link ainda pode vir com localhost até configurar FRONTEND_URL no Render');

  } catch (error) {
    if (error.response) {
      console.error('❌ Erro:', error.response.data.message);
    } else {
      console.error('❌ Erro de conexão:', error.message);
    }
  }
}

reenviarEmail();
