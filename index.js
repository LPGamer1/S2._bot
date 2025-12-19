const express = require('express');
const startBot = require('./core.js');
const app = express();
const PORT = process.env.PORT || 3000;

// Servidor Web para manter o Render ativo
app.get('/', (req, res) => {
    res.send('🚀 Bot de MassDM está online e operante!');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor Web rodando na porta ${PORT}`);
});

// Inicia o bot usando as variáveis de ambiente do Render
startBot(process.env.TOKEN, process.env.CLIENT_ID);
