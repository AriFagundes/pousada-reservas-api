const quartoService = require("../services/quarto.service");

async function criar(req, res) {
    try {
        const quarto = await quartoService.criar(req.body);
        return res.status(201).json(quarto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function listar(req, res) {
    try {
        const { hotelId } = req.query;
        const quartos = await quartoService.listar(hotelId);
        return res.status(200).json(quartos);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const quarto = await quartoService.buscarPorId(req.params.id);
        return res.status(200).json(quarto);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function verificarDisponibilidade(req, res) {
    try {
        const { hotelId, dataCheckIn, dataCheckOut, tipoQuartoId } = req.query;
        const quartosDisponiveis = await quartoService.verificarDisponibilidade(
            hotelId,
            dataCheckIn,
            dataCheckOut,
            tipoQuartoId
        );
        return res.status(200).json(quartosDisponiveis);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function atualizar(req, res) {
    try {
        const quarto = await quartoService.atualizar(req.params.id, req.body);
        return res.status(200).json(quarto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deletar(req, res) {
    try {
        await quartoService.deletar(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    verificarDisponibilidade,
    atualizar,
    deletar
};
