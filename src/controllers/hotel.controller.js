const hotelService = require("../services/hotel.service");

async function criar(req, res) {
    try {
        const hotel = await hotelService.criar(req.body);
        return res.status(201).json(hotel);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function listar(req, res) {
    try {
        const hoteis = await hotelService.listar();
        return res.status(200).json(hoteis);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function buscarPorId(req, res) {
    try {
        const hotel = await hotelService.buscarPorId(req.params.id);
        return res.status(200).json(hotel);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

async function atualizar(req, res) {
    try {
        const hotel = await hotelService.atualizar(req.params.id, req.body);
        return res.status(200).json(hotel);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deletar(req, res) {
    try {
        await hotelService.deletar(req.params.id);
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
