//require('dotenv').config();
let relay = new (require('ws')).Server({port: 443});
clients = {};    
relay.on('connection', function (client, req) {
    let user = crypto.randomUUID();
    clients[user] = client;

    let server = new WebSocket(process.env.SERVER);
    server.on('message', function (message){         
        client.send(message);
    });

    client.on('close', function () {
        delete clients[user];
        if (isEmpty(clients)) server.close();
    });
});