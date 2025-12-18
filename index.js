const http = require('http');
const startBot = require('./core.js');

http.createServer((req, res) => {
  res.write(`SP4M_B0T Ativo - Modo: ${process.env.BOT_TYPE || 'MAIN'}`);
  res.end();
}).listen(process.env.PORT || 3000);

startBot(process.env.TOKEN_1, process.env.CLIENT_ID_1);
startBot(process.env.TOKEN_2, process.env.CLIENT_ID_2);
