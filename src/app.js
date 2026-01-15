
const express = require("express");
const cors = require("cors");

const hotelRoutes = require("./routes/hotel.routes");
const tipoQuartoRoutes = require("./routes/tipoQuarto.routes");
const quartoRoutes = require("./routes/quarto.routes");
const clienteRoutes = require("./routes/cliente.routes");
const reservasRoutes = require("./routes/reservas.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const configuracaoRoutes = require("./routes/configuracao.routes");

const app = express();

// Configuração de CORS mais robusta
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://greatic.io',
            'http://greatic.io',
            'https://www.greatic.io',
            'http://www.greatic.io',
            'https://clientes.greatic.io',
            'http://clientes.greatic.io',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5500',
            'http://localhost:5500'
        ];

        // Permite requisições sem origin (como mobile apps ou requests de ferramentas)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/hoteis", hotelRoutes);
app.use("/tipos-quarto", tipoQuartoRoutes);
app.use("/quartos", quartoRoutes);
app.use("/clientes", clienteRoutes);
app.use("/reservas", reservasRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/configuracoes", configuracaoRoutes);

app.get("/", (req, res) => {
    res.send("API de Reservas rodando 🚀");
});

module.exports = app;
