#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'https://pousada-reservas-api.onrender.com';
const EMAIL = 'aricontato1@gmail.com';
const SENHA_ADMIN = 'admin123'; // Mude isso!

async function deletarUsuarioRender() {
  try {
    console.log(`🗑️  Deletando usuário ${EMAIL} do Render...\n`);

    const response = await axios.post(`${API_URL}/admin/deletar-usuario`, {
      email: EMAIL,
      senhaAdmin: SENHA_ADMIN
    });

    console.log('✅', response.data.message);
    console.log('\n🎉 Agora você pode criar uma nova conta com este email!');

  } catch (error) {
    if (error.response) {
      console.error('❌ Erro:', error.response.data.message);
    } else {
      console.error('❌ Erro de conexão:', error.message);
    }
  }
}

deletarUsuarioRender();
