const clienteService = require("../services/cliente.service");

async function criar(req, res) {
    try {
        const cliente = await clienteService.criar(req.body);
        return res.status(201).json(cliente);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function listar(req, res) {
    try {
        const clientes = await clienteService.listar();
        return res.status(200).json(clientes);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const cliente = await clienteService.buscarPorId(req.params.id);
        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function buscarPorEmail(req, res) {
    try {
        const cliente = await clienteService.buscarPorEmail(req.params.email);
        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function atualizar(req, res) {
    try {
        const cliente = await clienteService.atualizar(req.params.id, req.body);
        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deletar(req, res) {
    try {
        await clienteService.deletar(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    buscarPorEmail,
    atualizar,
    deletar
};
