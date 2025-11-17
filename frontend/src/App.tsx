import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import dayjs from "dayjs";
import clsx from "clsx";

import Login from "./pages/Login";
import Register from "./pages/Register";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket = io(API, { autoConnect: false });

type User = {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
};

export default function App() {
  // AUTH STATE
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  // CHAT STATE
  const [room, setRoom] = useState("general");
  const [rooms] = useState(["general", "random", "dev"]);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // normalize avatar URL
  function makeAvatarUrl(avatar?: string | null) {
    if (!avatar) return "https://placehold.co/80";
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/")) return API + avatar;
    return API + "/uploads/" + avatar;
  }

  // SOCKET SETUP
  useEffect(() => {
    if (token && user) {
      socket.auth = { token, user };
      socket.connect();

      socket.emit("join_room", room);

      socket.on("receive_message", (msg: any) => {
        setMessages((m) => [...m, msg]);
        scrollToBottom();
      });

      socket.on("reaction_update", (msg: any) => {
        setMessages((m) => m.map((x) => (x._id === msg._id ? msg : x)));
      });

      socket.on("typing", ({ userId, typing }: any) => {
        setTypingUsers((t) => ({ ...t, [userId]: typing }));
      });
    }

    return () => {
      socket.off("receive_message");
      socket.off("reaction_update");
      socket.off("typing");
      socket.disconnect();
    };
  }, [token, user, room]);

  // LOAD MESSAGES
  useEffect(() => {
    if (token) {
      axios
        .get(API + "/api/messages/" + room, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((r) => setMessages(r.data))
        .catch(() => {});
    }
  }, [room, token]);

  function scrollToBottom() {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  // SEND MESSAGE
  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text && !file) return;

    let fileUrl = "";
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const r = await axios.post(API + "/api/files/upload", fd, {
          headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
        });
        fileUrl = r.data.url || "";
      } catch (err) {}
    }

    const msg = {
      sender: user,
      text,
      room,
      fileUrl,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", { room, message: msg });
    setText("");
    setFile(null);
    scrollToBottom();
  }

  // TYPING
  function onComposerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    socket.emit("typing", { room, userId: user?._id, typing: !!e.target.value });
  }

  // REACTIONS
  function reactionCount(msg: any, emoji: string) {
    return msg.reactions?.filter((r: any) => r.emoji === emoji).length || 0;
  }

  function hasReacted(msg: any, emoji: string) {
    return msg.reactions?.some((r: any) => r.userId === (user?._id || user?.id)) && msg.reactions.some((r: any) => r.emoji === emoji);
  }

  function toggleReaction(msg: any, emoji: string) {
    socket.emit("react", {
      room,
      messageId: msg._id,
      userId: user?._id || user?.id,
      emoji,
    });
  }

  // AVATAR UPLOAD
  function uploadAvatarDirect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setSelectedAvatar(f);
  }

  async function saveAvatar() {
    if (!selectedAvatar || !token) return;

    const fd = new FormData();
    fd.append("avatar", selectedAvatar);

    try {
      const res = await axios.post(API + "/api/users/avatar", fd, {
        headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSelectedAvatar(null);
      }
    } catch (err) {
      console.error("avatar upload error", err);
    }
  }

  // LOGOUT
  function logout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.reload();
  }

  // AUTH PAGES
  if (!token || !user) {
    return authPage === "login" ? (
      <Login
        onSuccess={({ token, user }: any) => {
          setToken(token);
          setUser(user);
        }}
        switchToRegister={() => setAuthPage("register")}
      />
    ) : (
      <Register
        onSuccess={({ token, user }: any) => {
          setToken(token);
          setUser(user);
        }}
        switchToLogin={() => setAuthPage("login")}
      />
    );
  }

  // MAIN CHAT UI
  return (
    <div className="layout container flex gap-4 p-4 min-h-screen">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img src={makeAvatarUrl(user.avatar)} className="w-14 h-14 rounded-md object-cover" />
            <div>
              <div className="font-bold">{user.username}</div>
              <div className="text-sm opacity-70">{user.email}</div>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="mt-4">
            <label className="block text-sm mb-2">Change avatar</label>
            <input type="file" accept="image/*" onChange={uploadAvatarDirect} />
            {selectedAvatar && (
              <div className="flex gap-2 mt-2">
                <button className="btn" onClick={saveAvatar}>Save Avatar</button>
                <button className="px-3 py-2 border rounded-md" onClick={() => setSelectedAvatar(null)}>Cancel</button>
              </div>
            )}
          </div>

          {/* Rooms */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Rooms</h4>
            <div className="flex flex-col gap-2">
              {rooms.map((r) => (
                <button
                  key={r}
                  className={clsx("text-left p-2 rounded-md", r === room && "bg-slate-800/50")}
                  onClick={() => setRoom(r)}
                >
                  #{r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn w-full mt-6" onClick={logout}>Log Out</button>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="main">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">#{room}</h3>
          <div className="text-sm opacity-80">
            {Object.values(typingUsers).some(Boolean) ? "Someone is typing..." : ""}
          </div>
        </header>

        {/* MESSAGES */}
        <section className="flex-1 overflow-auto p-2">
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <div
                key={m._id}
                className={clsx(
                  "message flex gap-3",
                  m.sender?._id === user._id && "msg-mine"
                )}
              >
                <img src={makeAvatarUrl(m.sender?.avatar)} className="avatar" />
                <div>
                  <div className="flex items-center gap-2">
                    <strong>{m.sender?.username}</strong>
                    <span className="text-xs opacity-60">
                      {dayjs(m.createdAt).format("HH:mm")}
                    </span>
                  </div>

                  {m.fileUrl && (
                    <img src={API + m.fileUrl} className="max-w-xs rounded-md mt-2" />
                  )}

                  <div className="mt-2">{m.text}</div>

                  {/* Reaction Buttons */}
                  <div className="flex gap-2 mt-2 items-center text-sm">
                    {["❤️", "🔥", "😂"].map((emoji) => (
                      <button
                        key={emoji}
                        className={clsx(
                          "px-2 py-1 rounded-full border",
                          hasReacted(m, emoji) && "bg-gradient-to-r from-cyan-400 to-violet-400 text-slate-900"
                        )}
                        onClick={() => toggleReaction(m, emoji)}
                      >
                        {emoji} {reactionCount(m, emoji) || ""}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* COMPOSER */}
        <form className="composer" onSubmit={sendMessage}>
          <input className="input" value={text} onChange={onComposerChange} placeholder="Say something..." />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="btn" type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}
