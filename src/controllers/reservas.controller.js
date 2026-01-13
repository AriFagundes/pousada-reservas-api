const reservasService = require("../services/reservas.service");

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

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    cancelar,
    confirmar,
    checkIn,
    checkOut
};
