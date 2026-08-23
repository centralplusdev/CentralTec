const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "Backend da Central+ funcionando!"
    });
});

app.get("/api/teste", (req, res) => {
    res.json({
        sucesso: true,
        mensagem: "API funcionando corretamente!"
    });
});

module.exports = app;
