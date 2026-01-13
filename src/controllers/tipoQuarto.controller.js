const tipoQuartoService = require("../services/tipoQuarto.service");

async function criar(req, res) {
    try {
        const tipoQuarto = await tipoQuartoService.criar(req.body);
        return res.status(201).json(tipoQuarto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function listar(req, res) {
    try {
        const tiposQuarto = await tipoQuartoService.listar();
        return res.status(200).json(tiposQuarto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const tipoQuarto = await tipoQuartoService.buscarPorId(req.params.id);
        return res.status(200).json(tipoQuarto);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function atualizar(req, res) {
    try {
        const tipoQuarto = await tipoQuartoService.atualizar(req.params.id, req.body);
        return res.status(200).json(tipoQuarto);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deletar(req, res) {
    try {
        await tipoQuartoService.deletar(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar
};
