const reservasService = require("../services/reservas.service");
const prisma = require("../config/prisma");
const { enviarEmailConfirmacaoReserva, enviarEmailNotificacaoHotel } = require("../services/email.service");

// Calcular dias entre datas
function calcularDias(dataCheckIn, dataCheckOut) {
  const inicio = new Date(dataCheckIn);
  const fim = new Date(dataCheckOut);
  const diferenca = fim - inicio;
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

// ===== NOVO: Criar reserva via formulário externo (sem cliente logado) =====
async function criarViaFormulario(req, res) {
    try {
        const {
            hotelId,
            tipoQuartoId,
            dataCheckIn,
            dataCheckOut,
            numeroPessoas,
            clienteNome,
            clienteEmail,
            clienteTelefone
        } = req.body;

        // Validar campos obrigatórios
        if (!hotelId || !tipoQuartoId || !dataCheckIn || !dataCheckOut || !numeroPessoas || !clienteNome || !clienteEmail) {
            return res.status(400).json({ error: "Campos obrigatórios faltando" });
        }

        // Validar datas
        const inicio = new Date(dataCheckIn);
        const fim = new Date(dataCheckOut);

        if (fim <= inicio) {
            return res.status(400).json({ error: "Data de check-out deve ser posterior ao check-in" });
        }

        // Buscar hotel
        const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
        if (!hotel) {
            return res.status(404).json({ error: "Hotel não encontrado" });
        }

        // Buscar tipo quarto
        const tipoQuarto = await prisma.tipoQuarto.findUnique({
            where: { id: tipoQuartoId }
        });
        if (!tipoQuarto) {
            return res.status(404).json({ error: "Tipo de quarto não encontrado" });
        }

        // Validar capacidade
        if (numeroPessoas > tipoQuarto.capacidadePessoas) {
            return res.status(400).json({ 
                error: `Capacidade máxima do quarto: ${tipoQuarto.capacidadePessoas} pessoas` 
            });
        }

        // Buscar quartos deste tipo no hotel
        const quartos = await prisma.quarto.findMany({
            where: {
                tipoQuartoId,
                hotelId
            },
            select: { id: true }
        });

        if (quartos.length === 0) {
            return res.status(400).json({ error: "Nenhum quarto deste tipo disponível" });
        }

        // Buscar reservas que conflitam
        const reservasConflitantes = await prisma.reserva.findMany({
            where: {
                quartoId: { in: quartos.map(q => q.id) },
                status: { in: ['CONFIRMADA', 'CHECKED_IN', 'PENDENTE'] },
                AND: [
                    { dataCheckIn: { lt: fim } },
                    { dataCheckOut: { gt: inicio } }
                ]
            }
        });

        // Encontrar quarto disponível
        const quartosOcupados = reservasConflitantes.map(r => r.quartoId);
        const quartoDisponivel = quartos.find(q => !quartosOcupados.includes(q.id));

        if (!quartoDisponivel) {
            return res.status(400).json({ error: "Nenhum quarto disponível para este período" });
        }

        // Criar ou atualizar cliente
        let cliente = await prisma.cliente.findUnique({
            where: { email: clienteEmail }
        });

        if (!cliente) {
            cliente = await prisma.cliente.create({
                data: {
                    nome: clienteNome,
                    email: clienteEmail,
                    telefone: clienteTelefone || ''
                }
            });
        }

        // Calcular valor total
        const dias = calcularDias(dataCheckIn, dataCheckOut);
        const valorTotal = dias * tipoQuarto.precoBase;

        // Criar reserva
        const reserva = await prisma.reserva.create({
            data: {
                clienteId: cliente.id,
                quartoId: quartoDisponivel.id,
                hotelId,
                dataCheckIn: inicio,
                dataCheckOut: fim,
                numeroPessoas,
                valorTotal: parseFloat(valorTotal.toFixed(2)),
                status: 'PENDENTE',
                dias
            },
            include: {
                cliente: true,
                quarto: {
                    include: {
                        tipoQuarto: true,
                        hotel: true
                    }
                }
            }
        });

        // Enviar emails (não bloqueia a resposta)
        enviarEmailConfirmacaoReserva(reserva, reserva.cliente, reserva.quarto, reserva.quarto.hotel).catch(err => {
            console.error('Erro ao enviar email de confirmação:', err);
        });
        
        enviarEmailNotificacaoHotel(reserva, reserva.cliente, reserva.quarto, reserva.quarto.hotel).catch(err => {
            console.error('Erro ao enviar email para hotel:', err);
        });

        return res.status(201).json({
            mensagem: "Reserva criada com sucesso!",
            reserva: {
                id: reserva.id,
                dataCheckIn: reserva.dataCheckIn,
                dataCheckOut: reserva.dataCheckOut,
                dias,
                valorTotal: reserva.valorTotal,
                status: reserva.status,
                quarto: {
                    numero: reserva.quarto.numero,
                    tipo: reserva.quarto.tipoQuarto.nome
                },
                cliente: {
                    nome: reserva.cliente.nome,
                    email: reserva.cliente.email
                }
            }
        });

    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        return res.status(500).json({ error: error.message || "Erro ao criar reserva" });
    }
}

async function criar(req, res) {
    try {
        const reserva = await reservasService.criar(req.body);
        return res.status(201).json(reserva);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function listar(req, res) {
    try {
        const { hotelId, clienteId, status } = req.query;
        const reservas = await reservasService.listar({ hotelId, clienteId, status });
        return res.status(200).json(reservas);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const reserva = await reservasService.buscarPorId(req.params.id);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function atualizar(req, res) {
    try {
        const reserva = await reservasService.atualizar(req.params.id, req.body);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function cancelar(req, res) {
    try {
        const reserva = await reservasService.cancelar(req.params.id);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function confirmar(req, res) {
    try {
        const reserva = await reservasService.confirmar(req.params.id);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function checkIn(req, res) {
    try {
        const reserva = await reservasService.checkIn(req.params.id);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function checkOut(req, res) {
    try {
        const reserva = await reservasService.checkOut(req.params.id);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deletar(req, res) {
    try {
        await reservasService.deletar(req.params.id);
        return res.status(200).json({ mensagem: "Reserva excluída com sucesso" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    criar,
    criarViaFormulario,
    listar,
    buscarPorId,
    atualizar,
    cancelar,
    confirmar,
    checkIn,
    checkOut,
    deletar
};
