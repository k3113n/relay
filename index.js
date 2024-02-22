//require('dotenv').config();
const WebSocket = require('ws');
const crypto = require('crypto');

const isEmpty = (variable) => {
    return (
      variable &&
      Object.keys(variable).length === 0 &&
      variable.constructor === Object
    );
};

let server = null;
let last_message = "";
let relay = new WebSocket.Server({port: 443});
let clients = {};    

relay.on('connection', function (client) {
    let user = crypto.randomUUID();
    clients[user] = client;
    client.send(last_message);

    if(!server) {
        server = new WebSocket(process.env.SERVER);

        server.on('open', function () {
            server.on('message', function (message){ 
                last_message = message;        
                Object.values(clients).forEach(client => client.send(message));
            });
    
            server.on('close', function() {
                server = null;
            });
        });
    }

    client.on('close', function () {
        delete clients[user];
        if(isEmpty(clients) && server && server.readyState === WebSocket.OPEN) server.close();
    });
});