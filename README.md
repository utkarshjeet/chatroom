# 🚀 Anonymous Live Chat Room

A modern, real-time anonymous chat application built with vanilla JavaScript, Node.js, Express, and Socket.IO. Features a sleek black interface with parrot green accents and no authentication required.

![Chat Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-Node.js%20%7C%20Socket.IO%20%7C%20Vanilla%20JS-blue)

## ✨ Features

- **🔐 Anonymous Chat**: No sign-up or authentication required
- **🎨 Modern UI**: Clean black background with parrot green accents
- **⚡ Real-time Messaging**: Instant message delivery using Socket.IO
- **😊 Emoji Support**: Built-in emoji picker with popular emojis
- **👥 User Presence**: See when users join and leave the chat
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🕒 Timestamps**: Messages show when they were sent
- **🎯 Gender Display**: Optional gender selection (M/F/O) shown in messages
- **🔒 Input Validation**: Prevents empty usernames and long messages

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **Vanilla JavaScript**: No frameworks, pure JS
- **Socket.IO Client**: Real-time communication

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Socket.IO**: Real-time bidirectional communication
- **CORS**: Cross-origin resource sharing

## 📁 Project Structure

```
anonymous-chat/
├── client/
│   ├── index.html        # Home page (username & gender input)
│   ├── chat.html         # Chat room UI
│   ├── style.css         # All styling
│   └── script.js         # Frontend logic
├── server/
│   ├── index.js          # Express + Socket.IO backend
│   └── package.json      # Dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd anonymous-chat
   ```

2. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Enter a username and optional gender
   - Click "Join Chat Room" to start chatting!

### Running in Production

```bash
# Set environment variables
export PORT=3000
export NODE_ENV=production

# Start the server
npm start
```

## 🌐 Deployment

### Option 1: Vercel + Render (Recommended)

#### Frontend (Vercel)
1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy from project root
   vercel
   ```

2. **Configure environment**
   - Set `REACT_APP_SOCKET_URL` to your backend URL

#### Backend (Render)
1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings**:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
4. **Set environment variables**:
   - `PORT`: 10000 (or your preferred port)
   - `NODE_ENV`: production

### Option 2: Railway

1. **Connect your GitHub repository to Railway**
2. **Deploy automatically**
3. **Set environment variables in Railway dashboard**

### Option 3: Heroku

1. **Create a Heroku app**
   ```bash
   heroku create your-chat-app
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `CORS_ORIGIN` | Allowed origins | * |

### Customization

#### Changing Colors
Edit `client/style.css`:
```css
/* Primary accent color */
--accent-color: #50fa7b; /* Parrot green */

/* Background gradient */
background: linear-gradient(135deg, #000, #1a1a1a);
```

#### Adding More Emojis
Edit `client/chat.html`:
```html
<div class="emoji-grid">
    <span class="emoji" data-emoji="😊">😊</span>
    <!-- Add more emojis here -->
</div>
```

## 📱 Usage

### For Users
1. **Enter Username**: Required field, must be filled
2. **Select Gender**: Optional (M/F/O)
3. **Join Chat**: Click "Join Chat Room" button
4. **Start Chatting**: Type messages and use emoji picker
5. **Real-time**: See messages from other users instantly

### Message Format
```
Username (Gender): Message content
Example: CuteTiger (F): what's up? 😊
```

## 🔒 Security Features

- **Input Sanitization**: All user inputs are escaped to prevent XSS
- **Message Length Limits**: Maximum 500 characters per message
- **CORS Protection**: Configured for secure cross-origin requests
- **No Data Persistence**: Messages are not stored, ensuring privacy

## 🐛 Troubleshooting

### Common Issues

1. **Socket.IO connection failed**
   - Check if server is running
   - Verify CORS settings
   - Check browser console for errors

2. **Messages not appearing**
   - Refresh the page
   - Check network connectivity
   - Verify Socket.IO client is loaded

3. **Styling issues**
   - Clear browser cache
   - Check CSS file path
   - Verify font loading

### Debug Mode

Enable debug logging:
```javascript
// In server/index.js
const io = socketIo(server, {
    cors: { origin: "*" },
    debug: true
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- Express.js for the web framework
- Inter font family for beautiful typography
- Emoji support for enhanced user experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include browser console logs if applicable

---

**Happy Chatting! 🎉** 