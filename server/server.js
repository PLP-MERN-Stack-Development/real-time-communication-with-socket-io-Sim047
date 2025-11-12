require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { Server } = require('socket.io');

// Models
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONFIG ======
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

if (!MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env');
  process.exit(1);
}

// ====== FILE UPLOAD ======
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// ====== MONGOOSE ======
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });

// ====== JWT Helpers ======
function generateToken(user) {
  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// ====== AUTH ======
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Wrong password' });
    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id.toString(), username: user.username },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ====== REST MESSAGES ======
app.get('/api/messages', async (req, res) => {
  const room = req.query.room || 'General';
  const msgs = await Message.find({ room }).sort({ createdAt: 1 });
  res.json(msgs);
});

// ====== FILE UPLOAD ======
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ====== SOCKET.IO ======
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error('Invalid user'));
    socket.user = { id: user._id.toString(), username: user.username };
    next();
  } catch {
    next(new Error('Auth failed'));
  }
});

io.on('connection', (socket) => {
  const u = socket.user;
  console.log(`🟢 ${u.username} connected`);

  // Join specific room
  socket.on('joinRoom', async (room) => {
    socket.join(room);
    socket.currentRoom = room;
    console.log(`${u.username} joined room ${room}`);
    const msgs = await Message.find({ room }).sort({ createdAt: 1 });
    socket.emit('roomMessages', msgs);
  });

  // Create message
  socket.on('sendMessage', async (data, ack) => {
    try {
      const msg = await Message.create({
        room: socket.currentRoom || 'General',
        text: data.text || '',
        username: u.username,
        userId: u.id,
        fileUrl: data.fileUrl || null,
        reactions: [],
      });
      io.to(socket.currentRoom || 'General').emit('message', msg);
      ack && ack({ status: 'ok' });
    } catch (err) {
      console.error('sendMessage error:', err);
      ack && ack({ status: 'error' });
    }
  });

  // Edit message (author only)
  socket.on('editMessage', async ({ messageId, text }, ack) => {
    const msg = await Message.findById(messageId);
    if (!msg) return ack({ status: 'not_found' });
    if (msg.userId !== u.id) return ack({ status: 'forbidden' });
    msg.text = text;
    await msg.save();
    io.to(msg.room).emit('messageUpdated', msg);
    ack({ status: 'ok' });
  });

  // Delete message (author only)
  socket.on('deleteMessage', async ({ messageId }, ack) => {
    const msg = await Message.findById(messageId);
    if (!msg) return ack({ status: 'not_found' });
    if (msg.userId !== u.id) return ack({ status: 'forbidden' });
    await msg.deleteOne();
    io.to(msg.room).emit('messageDeleted', { id: messageId });
    ack({ status: 'ok' });
  });

  // React to message
  socket.on('react', async ({ messageId, emoji }, ack) => {
    const msg = await Message.findById(messageId);
    if (!msg) return ack({ status: 'not_found' });
    const existing = msg.reactions.find(
      (r) => r.userId === u.id && r.emoji === emoji
    );
    if (existing) {
      msg.reactions = msg.reactions.filter(
        (r) => !(r.userId === u.id && r.emoji === emoji)
      );
    } else {
      msg.reactions.push({ userId: u.id, emoji });
    }
    await msg.save();
    io.to(msg.room).emit('reactionUpdate', {
      messageId,
      reactions: msg.reactions,
    });
    ack({ status: 'ok' });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 ${u.username} disconnected`);
  });
});

// ====== Serve built frontend ======
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
