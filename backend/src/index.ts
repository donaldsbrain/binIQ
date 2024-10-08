import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { ClientToServiceEvents, ServiceToClientEvents } from './domain/events';
import { subscribeToUpdates } from './services/layoutUpdateService';
import { demoLayout } from './demo/liveDemo';

// copied from sharks with lasers to get rid of stupid errors with socket.io - code seems identical but this works for some reason
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server<ClientToServiceEvents, ServiceToClientEvents>(server);

io.engine.on('headers', (headers: any) => {
  // allows cross origin (cors) connections
  headers['Access-Control-Allow-Origin'] = '*';
});

subscribeToUpdates(layout => io.emit('layoutUpdated', layout));

io.on('connection', (socket) => {
  console.log(`user sconnected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});

app.use((_, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.listen(3000, () => {
  console.log('listening on *:3000');

  setInterval(demoLayout, 2000);
});