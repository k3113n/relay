//require('dotenv').config();
const WebSocket = require('ws');

const isEmpty = (variable) => {
    return (
      variable &&
      Object.keys(variable).length === 0 &&
      variable.constructor === Object
    );
};

let server = null;
let relay = new WebSocket.Server({port: 443});
clients = {};    

relay.on('connection', function (client, req) {
    let user = crypto.randomUUID();
    clients[user] = client;

    if(!server) {
        server = new WebSocket(process.env.SERVER);

        server.on('message', function (message){         
            client.send(message);
        });

        server.on('close', function() {
            server = null;
        });
    }

    client.on('close', function () {
        delete clients[user];
        if(isEmpty(clients) && server) server.close();
    });
});