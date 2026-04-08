const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const http = require('http');
const app = require('./app');
const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port , ()=>{
    console.log(`server is listening at http://localhost:${port}`);
})