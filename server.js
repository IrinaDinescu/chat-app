const net = require('net');

const server = net.createServer();

const clients = [];

// an array of clients objects (sockets)
server.on('connection', (socket) => {
  console.log('A new connection to the server');
  const clientId = clients.length + 1;
  socket.write(`id-${clientId}`);

  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.on('data', (data) => {
    const dataString = data.toString('utf-8');

    const id = data.toString('utf-8').substring(0, dataString.indexOf('-'));
    const message = dataString.substring(dataString.indexOf('-message-') + 9);

    clients.forEach((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  // Broadcasting a message to everyone when someone leaves the chat room
  socket.on('end', () => {
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  clients.push({ id: clientId.toString(), socket });
});

server.listen(3008, '127.0.0.1', () => {
  console.log('opened server on', server.address());
});
