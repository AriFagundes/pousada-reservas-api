const axios = require('axios');

const API_URL = 'https://pousada-reservas-api.onrender.com';
const ADMIN_PASSWORD = 'admin123';

async function limparReservas() {
    try {
        console.log('🧹 Limpando reservas de teste...');
        
        const response = await axios.post(`${API_URL}/admin/limpar-dados-teste`, {
            senhaAdmin: ADMIN_PASSWORD
        });
        
        console.log('✅', response.data.mensagem);
        
    } catch (error) {
        console.error('❌ Erro:', error.response?.data || error.message);
    }
}

limparReservas();
