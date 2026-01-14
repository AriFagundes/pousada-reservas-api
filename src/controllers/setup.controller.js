const prisma = require("../config/prisma");

async function criarDadosIniciais(req, res) {
    try {
        const { senhaAdmin } = req.body;
        const SENHA_ADMIN = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (senhaAdmin !== SENHA_ADMIN) {
            return res.status(401).json({ message: 'Acesso negado' });
        }

        // 1. Criar Hotel
        const hotel = await prisma.hotel.upsert({
            where: { id: '1' },
            update: {},
            create: {
                id: '1',
                nome: 'Solare Inn',
                endereco: 'Rua das Flores, 123',
                cidade: 'São Paulo',
                estado: 'SP',
                telefone: '(11) 98765-4321',
                email: 'contato@solarinn.com.br'
            }
        });

        // 2. Criar Tipos de Quarto
        const tipoStandard = await prisma.tipoQuarto.upsert({
            where: { id: '1' },
            update: {},
            create: {
                id: '1',
                nome: 'Standard',
                descricao: 'Quarto confortável com cama de casal',
                capacidadePessoas: 2,
                precoBase: 150.00
            }
        });

        const tipoLuxo = await prisma.tipoQuarto.upsert({
            where: { id: '2' },
            update: {},
            create: {
                id: '2',
                nome: 'Luxo',
                descricao: 'Quarto luxuoso com vista para o mar',
                capacidadePessoas: 3,
                precoBase: 350.00
            }
        });

        // 3. Criar Quartos
        const quartos = [];
        for (let i = 101; i <= 105; i++) {
            const quarto = await prisma.quarto.upsert({
                where: { 
                    hotelId_numero: {
                        hotelId: hotel.id,
                        numero: i.toString()
                    }
                },
                update: {},
                create: {
                    numero: i.toString(),
                    andar: 1,
                    status: 'DISPONIVEL',
                    hotelId: hotel.id,
                    tipoQuartoId: i <= 103 ? tipoStandard.id : tipoLuxo.id
                }
            });
            quartos.push(quarto);
        }

        res.json({
            message: 'Dados iniciais criados com sucesso!',
            hotel,
            tiposQuarto: [tipoStandard, tipoLuxo],
            quartos
        });

    } catch (error) {
        console.error('❌ Erro ao criar dados iniciais:', error);
        res.status(500).json({ 
            message: 'Erro ao criar dados iniciais',
            error: error.message 
        });
    }
}

module.exports = {
    criarDadosIniciais
};
