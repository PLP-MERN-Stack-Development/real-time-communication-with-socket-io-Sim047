

````
# 💬 Rooms Chat — Real-time Chat Application

A modern **real-time chat application** built with:

- ⚡ **React + Vite (frontend)**
- 🧠 **Express + Socket.IO + MongoDB (backend)**
- 🔐 **JWT Authentication**
- 💬 **Room-based messaging**
- 📸 **Image upload and reactions**
- 🚀 Deployable on **Render** (server) and **Vercel** (client)

---

## 🌟 Features

✅ Real-time messaging with **Socket.IO**  
✅ Room-based chats (**General**, **Tech**, **Random**)  
✅ **Login/Register** with JWT  
✅ **Image uploads** using Multer  
✅ **Message reactions** (❤️ 👍 etc.)  
✅ **Online/offline status indicators**  
✅ **Read receipts & typing indicators**  
✅ **Clean, responsive UI**

---

## 🖼️ Screenshots

### 🔑 Login Page
<img src="./Login.png" alt="Login Page" width="600"/>

---

### 💬 Chat Room
<img src="./Home.png" alt="Chat Room" width="600"/>

---

### 🧵 Room Messages
<img src="./Chats.png" alt="Messages with Reactions" width="600"/>

---

## ⚙️ Installation (Run Locally)

### 🧩 Backend (Server)
```bash
cd server
cp .env.example .env
npm install
npm run build
npm run seed   # optional: seeds demo users (Alice & Bob)
npm start
````

Server runs at **[http://localhost:5000](http://localhost:5000)**

---

### 💻 Frontend (Client)

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend runs at **[http://localhost:5173](http://localhost:5173)**

---

## 🧾 Environment Variables

### Server `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat_app
JWT_SECRET=your_secret_here
CLIENT_ORIGIN=http://localhost:5173
```

### Client `.env`

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Deployment Guide

### 🌐 Deploy Backend on Render

1. Push your project to GitHub.
2. Create a **Web Service** on [Render](https://render.com/).
3. Choose the `/server` folder as your root.
4. Add these environment variables:

   * `MONGO_URI`
   * `JWT_SECRET`
   * `CLIENT_ORIGIN=https://your-frontend.vercel.app`
5. Build Command:

   ```bash
   npm install && npm run build
   ```
6. Start Command:

   ```bash
   npm run start
   ```

---

### 💨 Deploy Frontend on Vercel

1. Create a project on [Vercel](https://vercel.com/).
2. Choose the `/client` directory as the root.
3. Add environment variable:

   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Build Command:

   ```bash
   npm install && npm run build
   ```
5. Output Directory:

   ```
   dist
   ```

---

## 🧠 Default Demo Accounts

| Email                                         | Password |
| --------------------------------------------- | -------- |
| [simo@test.com](mailto:simo@test.com)         | 123456 |
| [sonnie@test.com](mailto:sonnie@test.com)     | 123456 |

---

## 🧰 Tech Stack

**Frontend:** React, Vite, Socket.IO Client, Axios, React Toastify
**Backend:** Express, Socket.IO, MongoDB (Mongoose), TypeScript
**Security:** JWT Auth, Helmet, HPP, Rate Limiting
**Deployment:** Render (API), Vercel (Client)

---

## 🧑‍💻 Developer

**Simo Web** — Full Stack Developer
🚀 Built with ❤️ using the MERN + Socket.IO stack

---

## 📝 License

MIT License © 2025

```

