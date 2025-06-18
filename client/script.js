// Global variables
let socket;
let currentUser = {};

// Backend URL - CHANGE THIS TO YOUR BACKEND URL WHEN DEPLOYING
// For local development: leave as is
// For production: replace with your backend URL (e.g., 'https://your-app.onrender.com')
const BACKEND_URL = 'https://your-backend-url.onrender.com';

// Simple path detection
const currentPath = window.location.pathname;
const isHomePage = currentPath === '/' || currentPath === '/index.html' || currentPath === '' || currentPath.includes('index');
const isChatPage = currentPath.includes('chat.html');

// Home page functionality
if (isHomePage) {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        const joinBtn = document.getElementById('joinBtn');
        const usernameInput = document.getElementById('username');
        const genderSelect = document.getElementById('gender');

        if (joinBtn && usernameInput && genderSelect) {
            // Add click event
            joinBtn.onclick = function() {
                const username = usernameInput.value.trim();
                const gender = genderSelect.value;

                if (!username) {
                    alert('Please enter a username to join the chat room.');
                    usernameInput.focus();
                    return;
                }

                // Store user data in localStorage
                currentUser = {
                    username: username,
                    gender: gender
                };
                localStorage.setItem('chatUser', JSON.stringify(currentUser));

                // Redirect to chat room
                window.location.href = 'chat.html';
            };

            // Add Enter key event
            usernameInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    joinBtn.click();
                }
            };
        }
    });
}

// Chat page functionality
if (isChatPage) {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const emojiBtn = document.getElementById('emojiBtn');
        const emojiDropdown = document.getElementById('emojiDropdown');

        // Load user data from localStorage
        const savedUser = localStorage.getItem('chatUser');
        if (!savedUser) {
            alert('Please enter your username first.');
            window.location.href = 'index.html';
            return;
        }

        currentUser = JSON.parse(savedUser);

        // Initialize Socket.IO
        initializeSocket();

        // Event listeners
        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        // Emoji picker functionality
        if (emojiBtn && emojiDropdown) {
            emojiBtn.addEventListener('click', toggleEmojiDropdown);
            
            // Close emoji dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!emojiBtn.contains(e.target) && !emojiDropdown.contains(e.target)) {
                    emojiDropdown.classList.remove('show');
                }
            });

            // Emoji selection
            document.querySelectorAll('.emoji').forEach(emoji => {
                emoji.addEventListener('click', (e) => {
                    const selectedEmoji = e.target.dataset.emoji;
                    if (messageInput) {
                        messageInput.value += selectedEmoji;
                        messageInput.focus();
                    }
                    emojiDropdown.classList.remove('show');
                });
            });
        }

        function initializeSocket() {
            // Connect to Socket.IO server
            socket = io(BACKEND_URL);

            // Connection events
            socket.on('connect', () => {
                addSystemMessage('Connected to chat room');
            });

            socket.on('disconnect', () => {
                addSystemMessage('Disconnected from chat room');
            });

            // Message events
            socket.on('message', (data) => {
                addMessage(data);
            });

            socket.on('userJoined', (data) => {
                addSystemMessage(`${data.username} joined the chat`);
            });

            socket.on('userLeft', (data) => {
                addSystemMessage(`${data.username} left the chat`);
            });

            // Join the chat room
            socket.emit('join', currentUser);
        }

        function sendMessage() {
            if (!messageInput) return;
            
            const message = messageInput.value.trim();
            
            if (!message) {
                return;
            }

            if (message.length > 500) {
                alert('Message is too long. Maximum 500 characters allowed.');
                return;
            }

            // Emit message to server
            socket.emit('message', {
                content: message,
                username: currentUser.username,
                gender: currentUser.gender,
                timestamp: new Date()
            });

            // Clear input
            messageInput.value = '';
            messageInput.focus();
        }

        function addMessage(data) {
            if (!messagesContainer) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';

            const time = formatTime(data.timestamp);
            const genderDisplay = data.gender ? `(${data.gender})` : '';

            messageDiv.innerHTML = `
                <div class="message-header">
                    <span class="username">${escapeHtml(data.username)}</span>
                    <span class="gender">${genderDisplay}</span>
                    <span class="time">${time}</span>
                </div>
                <div class="message-content">${escapeHtml(data.content)}</div>
            `;

            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
        }

        function addSystemMessage(message) {
            if (!messagesContainer) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.style.borderLeftColor = 'rgba(255, 255, 255, 0.3)';
            messageDiv.style.background = 'rgba(255, 255, 255, 0.02)';

            messageDiv.innerHTML = `
                <div class="message-content" style="color: rgba(255, 255, 255, 0.6); font-style: italic;">
                    ${escapeHtml(message)}
                </div>
            `;

            messagesContainer.appendChild(messageDiv);
            scrollToBottom();
        }

        function toggleEmojiDropdown() {
            if (emojiDropdown) {
                emojiDropdown.classList.toggle('show');
            }
        }

        function scrollToBottom() {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }

        function formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInHours = (now - date) / (1000 * 60 * 60);

            if (diffInHours < 24) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Auto-focus message input
        if (messageInput) {
            messageInput.focus();
        }

        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && messageInput) {
                messageInput.focus();
            }
        });

        // Handle beforeunload to notify server
        window.addEventListener('beforeunload', () => {
            if (socket) {
                socket.emit('leave', currentUser);
            }
        });
    });
}
