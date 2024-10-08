import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { demoLayout } from './demo/liveDemo';

const app = express();
const port = 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",  // Allow any origin (you can restrict this in production)
      methods: ["GET", "POST"]
    }
  });

// Basic Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handling custom events
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Echo the message back to all connected clients
        io.emit('message', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  demoLayout();
});
