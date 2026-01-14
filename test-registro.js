#!/usr/bin/env node

const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function testarRegistro() {
  try {
    const email = `teste-${Date.now()}@example.com`;
    
    console.log('🧪 Testando registro com email:', email);
    
    const response = await axios.post(`${API_URL}/auth/register`, {
      nome: 'Usuário Teste',
      email: email,
      senha: 'senha123'
    });
    
    console.log('✅ Registro bem-sucedido:', response.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testarRegistro();
