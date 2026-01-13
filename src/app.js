
const express = require("express");
const cors = require("cors");

const hotelRoutes = require("./routes/hotel.routes");
const tipoQuartoRoutes = require("./routes/tipoQuarto.routes");
const quartoRoutes = require("./routes/quarto.routes");
const clienteRoutes = require("./routes/cliente.routes");
const reservasRoutes = require("./routes/reservas.routes");

const app = express();

// Configuração de CORS para aceitar requisições do frontend
const corsOptions = {
    origin: [
        'https://clientes.greatic.io',
        'http://clientes.greatic.io',
        'http://localhost:3000',
        'http://localhost:5173' // Vite dev server
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/hoteis", hotelRoutes);
app.use("/tipos-quarto", tipoQuartoRoutes);
app.use("/quartos", quartoRoutes);
app.use("/clientes", clienteRoutes);
app.use("/reservas", reservasRoutes);

app.get("/", (req, res) => {
    res.send("API de Reservas rodando 🚀");
});

module.exports = app;
