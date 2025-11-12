import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const SERVER_URL = "http://localhost:5000";
let socket;

function App() {
  const [view, setView] = useState("login");
  const [rooms] = useState(["General", "Tech", "Random"]);
  const [currentRoom, setCurrentRoom] = useState("General");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [editMsgId, setEditMsgId] = useState(null);
  const messagesEndRef = useRef(null);

  // ===== AUTH =====
  const register = async () => {
    await axios.post(`${SERVER_URL}/api/register`, { username, email, password });
    alert("Registered! Please login.");
    setView("login");
  };

  const login = async () => {
    const res = await axios.post(`${SERVER_URL}/api/login`, { email, password });
    setToken(res.data.token);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    setView("chat");
  };

  const logout = () => {
    localStorage.removeItem("token");
    socket && socket.disconnect();
    setUser(null);
    setView("login");
  };

  // ===== SOCKET =====
  useEffect(() => {
    if (!token || !user) return;
    socket = io(SERVER_URL, { auth: { token } });

    socket.on("roomMessages", (msgs) => setChat(msgs));
    socket.on("message", (msg) => setChat((p) => [...p, msg]));
    socket.on("messageUpdated", (msg) =>
      setChat((p) => p.map((m) => (m._id === msg._id ? msg : m)))
    );
    socket.on("messageDeleted", ({ id }) =>
      setChat((p) => p.filter((m) => m._id !== id))
    );
    socket.on("reactionUpdate", ({ messageId, reactions }) =>
      setChat((p) =>
        p.map((m) => (m._id === messageId ? { ...m, reactions } : m))
      )
    );

    socket.emit("joinRoom", currentRoom);
    fetchExistingMessages(currentRoom);
    return () => socket.disconnect();
  }, [token, user, currentRoom]);

  // ===== FETCH EXISTING MESSAGES =====
  const fetchExistingMessages = async (room) => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/messages?room=${room}`);
      setChat(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  // ===== CRUD =====
  const sendMessage = async () => {
    if (!message && !file) return;
    let fileUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post(`${SERVER_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fileUrl = uploadRes.data.url;
      setFile(null);
    }

    if (editMsgId) {
      socket.emit("editMessage", { messageId: editMsgId, text: message }, (ack) => {
        if (ack.status === "ok") {
          setMessage("");
          setEditMsgId(null);
        } else if (ack.status === "forbidden") {
          alert("You can only edit your own messages.");
        }
      });
    } else {
      socket.emit("sendMessage", { text: message, fileUrl }, (ack) => {
        if (ack.status === "ok") setMessage("");
      });
    }
  };

  const handleEdit = (msg) => {
    if (msg.userId !== user.id) {
      alert("You can only edit your own messages.");
      return;
    }
    setEditMsgId(msg._id);
    setMessage(msg.text);
  };

  const handleDelete = (msg) => {
    if (msg.userId !== user.id) {
      alert("You can only delete your own messages.");
      return;
    }
    if (window.confirm("Delete this message?")) {
      socket.emit("deleteMessage", { messageId: msg._id }, (ack) => {
        if (ack.status !== "ok") alert("Failed to delete message.");
      });
    }
  };

  const handleReaction = (messageId, emoji) => {
    socket.emit("react", { messageId, emoji });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // ===== UI =====
  if (view === "login")
    return (
      <div className="auth-page">
        <h2>Login</h2>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
        <p>
          No account? <span onClick={() => setView("register")}>Register</span>
        </p>
      </div>
    );

  if (view === "register")
    return (
      <div className="auth-page">
        <h2>Register</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={register}>Register</button>
      </div>
    );

  return (
    <div className="chat-container">
      <header>
        <h3>💬 Rooms Chat</h3>
        <div>
          <span style={{ marginRight: "12px" }}>👤 {user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="room-selector">
        {rooms.map((r) => (
          <button
            key={r}
            className={r === currentRoom ? "active" : ""}
            onClick={() => {
              setCurrentRoom(r);
              socket.emit("joinRoom", r);
              fetchExistingMessages(r);
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="messages">
        {chat.map((msg) => {
          const grouped =
            msg.reactions?.reduce((a, r) => {
              a[r.emoji] = (a[r.emoji] || 0) + 1;
              return a;
            }, {}) || {};
          return (
            <div key={msg._id} className={`message-box ${msg.userId === user.id ? "me" : ""}`}>
              <div className="bubble">
                <div className="bubble-header">
                  <strong>{msg.username}</strong>{" "}
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
                {msg.text && <p>{msg.text}</p>}
                {msg.fileUrl && (
                  <img src={`${SERVER_URL}${msg.fileUrl}`} alt="" className="thumb" />
                )}
                <div className="bubble-footer">
                  {msg.userId === user.id && (
                    <>
                      <button onClick={() => handleEdit(msg)}>✏️</button>
                      <button onClick={() => handleDelete(msg)}>🗑️</button>
                    </>
                  )}
                  <button onClick={() => handleReaction(msg._id, "❤️")}>
                    ❤️ {grouped["❤️"] || ""}
                  </button>
                  <button onClick={() => handleReaction(msg._id, "👍")}>
                    👍 {grouped["👍"] || ""}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="input">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>{editMsgId ? "Update" : "Send"}</button>
      </div>
    </div>
  );
}

export default App;
