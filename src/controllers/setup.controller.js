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

// Nova função para criar Solar de Penha
async function criarSolarDePenha(req, res) {
    try {
        const { senhaAdmin } = req.body;
        const SENHA_ADMIN = process.env.ADMIN_PASSWORD || 'admin123';
        
        if (senhaAdmin !== SENHA_ADMIN) {
            return res.status(401).json({ message: 'Acesso negado' });
        }

        // 1. Criar Hotel Solar de Penha
        const hotel = await prisma.hotel.upsert({
            where: { id: 'solar-penha' },
            update: {},
            create: {
                id: 'solar-penha',
                nome: 'Solar de Penha',
                endereco: 'Próximo ao Beto Carrero World',
                cidade: 'Penha',
                estado: 'SC',
                telefone: '(47) 9782-8637',
                email: 'contato@solardepen ha.com.br',
                descricao: 'Pousada aconchegante próxima ao Beto Carrero World'
            }
        });

        // 2. Criar Tipos de Quarto baseados no site
        const tipoSuiteMaster = await prisma.tipoQuarto.upsert({
            where: { id: 'suite-master-luxo' },
            update: {},
            create: {
                id: 'suite-master-luxo',
                nome: 'Suíte Master Luxo',
                descricao: 'Um refúgio de sofisticação com vista privilegiada e enxoval premium de 400 fios.',
                capacidadePessoas: 2,
                precoBase: 450.00
            }
        });

        const tipoSuiteFamilia = await prisma.tipoQuarto.upsert({
            where: { id: 'suite-familia-conforto' },
            update: {},
            create: {
                id: 'suite-familia-conforto',
                nome: 'Suíte Família Conforto',
                descricao: 'Espaço planejado para famílias que buscam praticidade e aconchego próximo ao parque.',
                capacidadePessoas: 4,
                precoBase: 580.00
            }
        });

        const tipoStandard = await prisma.tipoQuarto.upsert({
            where: { id: 'standard-solar' },
            update: {},
            create: {
                id: 'standard-solar',
                nome: 'Standard Solar',
                descricao: 'Conforto essencial com o melhor custo-benefício de Penha.',
                capacidadePessoas: 3,
                precoBase: 320.00
            }
        });

        // 3. Criar Quartos (3 de cada tipo = 9 quartos)
        const quartos = [];
        
        // 3 Suítes Master (101-103)
        for (let i = 101; i <= 103; i++) {
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
                    tipoQuartoId: tipoSuiteMaster.id
                }
            });
            quartos.push(quarto);
        }

        // 3 Suítes Família (201-203)
        for (let i = 201; i <= 203; i++) {
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
                    andar: 2,
                    status: 'DISPONIVEL',
                    hotelId: hotel.id,
                    tipoQuartoId: tipoSuiteFamilia.id
                }
            });
            quartos.push(quarto);
        }

        // 3 Standard (301-303)
        for (let i = 301; i <= 303; i++) {
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
                    andar: 3,
                    status: 'DISPONIVEL',
                    hotelId: hotel.id,
                    tipoQuartoId: tipoStandard.id
                }
            });
            quartos.push(quarto);
        }

        res.json({
            message: 'Solar de Penha criado com sucesso!',
            hotel,
            tiposQuarto: [tipoSuiteMaster, tipoSuiteFamilia, tipoStandard],
            quartos
        });

    } catch (error) {
        console.error('❌ Erro ao criar Solar de Penha:', error);
        res.status(500).json({ 
            message: 'Erro ao criar Solar de Penha',
            error: error.message 
        });
    }
}

module.exports = {
    criarDadosIniciais,
    criarSolarDePenha
};
