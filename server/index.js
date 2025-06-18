const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Store connected users
const connectedUsers = new Map();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/chat.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/chat.html'));
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/style.css'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/script.js'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user joining
    socket.on('join', (userData) => {
        // Store user data
        connectedUsers.set(socket.id, {
            id: socket.id,
            username: userData.username,
            gender: userData.gender,
            joinedAt: new Date()
        });

        // Notify other users
        socket.broadcast.emit('userJoined', {
            username: userData.username,
            timestamp: new Date()
        });

        console.log(`${userData.username} joined the chat`);
    });

    // Handle messages
    socket.on('message', (messageData) => {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
            const message = {
                content: messageData.content,
                username: user.username,
                gender: user.gender,
                timestamp: messageData.timestamp || new Date()
            };

            // Broadcast message to all connected clients
            io.emit('message', message);
            
            console.log(`${user.username}: ${messageData.content}`);
        }
    });

    // Handle user leaving
    socket.on('leave', (userData) => {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
            // Notify other users
            socket.broadcast.emit('userLeft', {
                username: user.username,
                timestamp: new Date()
            });

            console.log(`${user.username} left the chat`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
            // Notify other users
            socket.broadcast.emit('userLeft', {
                username: user.username,
                timestamp: new Date()
            });

            // Remove user from connected users
            connectedUsers.delete(socket.id);
            
            console.log(`${user.username} disconnected`);
        }

        console.log('Client disconnected:', socket.id);
    });

    // Handle typing indicators (optional feature)
    socket.on('typing', (isTyping) => {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
            socket.broadcast.emit('userTyping', {
                username: user.username,
                isTyping: isTyping
            });
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        connectedUsers: connectedUsers.size
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
