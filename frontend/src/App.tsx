<<<<<<< HEAD
// frontend/src/App.tsx
import React, { useEffect, useState, useRef, Fragment } from "react";
import io from "socket.io-client";
import axios from "axios";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
=======
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import dayjs from "dayjs";
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
import clsx from "clsx";

import Login from "./pages/Login";
import Register from "./pages/Register";
<<<<<<< HEAD
import StatusPicker from "./components/StatusPicker";
import SearchUsers from "./components/SearchUsers";
import ConversationsList from "./components/ConversationsList";
import AllUsers from "./pages/AllUsers";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", { weekStart: 1 });
=======
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket = io(API, { autoConnect: false });

<<<<<<< HEAD
// fallback avatar (in your environment)
const SAMPLE_AVATAR = "/mnt/data/c1621a7f-41b8-42c2-8b53-ba7d75f5e2dc.png";
const THEME_KEY = "banja-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(THEME_KEY) || "dark";
}

=======
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
type User = {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  avatar?: string;
<<<<<<< HEAD
  role?: string;
};

export default function App() {
  // THEME
  const [theme, setTheme] = useState<string>(getInitialTheme());
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // AUTH
=======
};

export default function App() {
  // AUTH STATE
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

<<<<<<< HEAD
  // Rooms / chat state
  const [room, setRoom] = useState<string>("general");
  const [rooms] = useState<string[]>(["general", "random", "dev"]);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState<string>("");
=======
  // CHAT STATE
  const [room, setRoom] = useState("general");
  const [rooms] = useState(["general", "random", "dev"]);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
  const [file, setFile] = useState<File | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

<<<<<<< HEAD
  // statuses map
  const [statuses, setStatuses] = useState<Record<string, any>>({});

  // UI helpers
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const unreadRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  // Conversations / DM state
  const [conversations, setConversations] = useState<any[]>([]);
  const [inDM, setInDM] = useState(false);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [view, setView] = useState<"chat" | "all-users">("chat");

  // editing
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // convenience: show my status
  const myStatus = statuses[String(user?._id || user?.id)] || null;

  function makeAvatarUrl(avatar?: string | null) {
    if (!avatar) return SAMPLE_AVATAR;
=======
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // normalize avatar URL
  function makeAvatarUrl(avatar?: string | null) {
    if (!avatar) return "https://placehold.co/80";
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/")) return API + avatar;
    return API + "/uploads/" + avatar;
  }

<<<<<<< HEAD
  // Socket setup and listeners
=======
  // SOCKET SETUP
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
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
<<<<<<< HEAD

      // message_edited now handled consistently (server should emit populated updated message)
      socket.on("message_edited", (updatedMsg: any) => {
        setMessages((m) => m.map((x) => (x._id === updatedMsg._id ? updatedMsg : x)));
      });

      // message_deleted expects server to send just id (or message object). We'll handle id.
      socket.on("message_deleted", (deletedMessageId: string | { _id?: string }) => {
        const id = typeof deletedMessageId === "string" ? deletedMessageId : deletedMessageId._id;
        setMessages((m) => m.filter((x) => x._id !== id));
      });

      socket.on("status_update", (payload: any) => {
        if (payload && payload.cleared && payload.user) {
          setStatuses((s) => {
            const copy = { ...s };
            delete copy[payload.user];
            return copy;
          });
        } else if (payload && payload.user) {
          const uid = String(payload.user._id || payload.user);
          setStatuses((s) => ({ ...s, [uid]: payload }));
        }
      });

      socket.on("error_message", (err: any) => {
        console.warn("socket error:", err);
      });
=======
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
    }

    return () => {
      socket.off("receive_message");
      socket.off("reaction_update");
      socket.off("typing");
<<<<<<< HEAD
      socket.off("message_edited");
      socket.off("message_deleted");
      socket.off("status_update");
      socket.off("error_message");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user, room]);

  // Load room messages (when in room view)
  useEffect(() => {
    if (token && view === "chat" && !inDM) {
      axios
        .get(API + "/api/messages/" + room, { headers: { Authorization: "Bearer " + token } })
        .then((r) => setMessages(r.data || []))
        .catch(() => {});
    }
  }, [room, token, view, inDM]);

  // Load DM messages when entering a conversation
  useEffect(() => {
    if (!token || !inDM || !activeConversation) return;
    axios
      .get(API + "/api/conversations/" + activeConversation._id + "/messages", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => setMessages(res.data || []))
      .catch((err) => console.error("DM messages error:", err));
  }, [token, inDM, activeConversation]);

  // Load statuses
  useEffect(() => {
    if (!token) return;
    axios
      .get(API + "/api/status", { headers: { Authorization: "Bearer " + token } })
      .then((r) => {
        const map: Record<string, any> = {};
        (r.data || []).forEach((st: any) => {
          const uid = String(st.user?._id || st.user);
          map[uid] = st;
        });
        setStatuses(map);
      })
      .catch(() => {});
  }, [token]);

  // Load user's conversations (for ConversationsList)
  useEffect(() => {
    if (!token) return;
    axios
      .get(API + "/api/conversations", { headers: { Authorization: "Bearer " + token } })
      .then((r) => setConversations(r.data || []))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 40);
    return () => clearTimeout(t);
  }, [messages.length, inDM, view]);
=======
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
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2

  function scrollToBottom() {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

<<<<<<< HEAD
  // Send message (rooms OR DMs)
=======
  // SEND MESSAGE
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
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

<<<<<<< HEAD
    const targetRoom = inDM && activeConversation ? activeConversation._id : room;

    const msg = {
      sender: user,
      text,
      room: targetRoom,
=======
    const msg = {
      sender: user,
      text,
      room,
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
      fileUrl,
      createdAt: new Date().toISOString(),
    };

<<<<<<< HEAD
    socket.emit("send_message", { room: targetRoom, message: msg });
=======
    socket.emit("send_message", { room, message: msg });
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
    setText("");
    setFile(null);
    scrollToBottom();
  }

<<<<<<< HEAD
  // Typing
  function onComposerChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    const targetRoom = inDM && activeConversation ? activeConversation._id : room;
    socket.emit("typing", { room: targetRoom, userId: user?._id, typing: !!e.target.value });
  }

  // Reactions helpers
  function reactionCount(msg: any, emoji: string) {
    return msg.reactions?.filter((r: any) => r.emoji === emoji).length || 0;
  }
  function hasReacted(msg: any, emoji: string) {
    return (
      msg.reactions?.some((r: any) => r.userId === (user?._id || user?.id)) &&
      msg.reactions.some((r: any) => r.emoji === emoji)
    );
  }
  function toggleReaction(msg: any, emoji: string) {
    const targetRoom = inDM && activeConversation ? activeConversation._id : room;
    socket.emit("react", {
      room: targetRoom,
=======
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
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
      messageId: msg._id,
      userId: user?._id || user?.id,
      emoji,
    });
  }

<<<<<<< HEAD
  // Avatar upload
=======
  // AVATAR UPLOAD
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
  function uploadAvatarDirect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setSelectedAvatar(f);
  }
<<<<<<< HEAD
  async function saveAvatar() {
    if (!selectedAvatar || !token) return;
    const fd = new FormData();
    fd.append("avatar", selectedAvatar);
=======

  async function saveAvatar() {
    if (!selectedAvatar || !token) return;

    const fd = new FormData();
    fd.append("avatar", selectedAvatar);

>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
    try {
      const res = await axios.post(API + "/api/users/avatar", fd, {
        headers: { Authorization: "Bearer " + token, "Content-Type": "multipart/form-data" },
      });
<<<<<<< HEAD
=======

>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSelectedAvatar(null);
      }
    } catch (err) {
      console.error("avatar upload error", err);
    }
  }

<<<<<<< HEAD
  // Logout
=======
  // LOGOUT
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
  function logout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
    window.location.reload();
  }

<<<<<<< HEAD
  // Edit / delete (edit now uses REST; delete tries per-user hide first)
  function startEdit(msg: any) {
    setEditingMessageId(msg._id);
    setEditingText(msg.text || "");
  }
  function cancelEdit() {
    setEditingMessageId(null);
    setEditingText("");
  }

  // --- SAVE EDIT (REST PUT) ---
  async function saveEdit(msgId: string) {
    if (!token) return;
    try {
      const res = await axios.put(
        API + "/api/messages/" + msgId,
        { text: editingText },
        { headers: { Authorization: "Bearer " + token } }
      );

      const updated = res.data;

      // Update local messages with the updated message (use updated._id)
      setMessages((m) => m.map((x) => (x._id === updated._id ? updated : x)));

      cancelEdit();
    } catch (err) {
      console.error("edit error", err);
    }
  }

  /**
   * Delete message but prefer per-user hide:
   * - tries POST /api/messages/:id/hide (which should add current user to hiddenFor array)
   * - if backend doesn't support, fall back to DELETE /api/messages/:id
   *
   * NOTE: Backend must implement /hide endpoint for per-user hide. If not present,
   * the fallback will remove the message globally.
   */
  async function deleteMessage(msgId: string) {
    if (!token) return;
    if (!confirm("Delete this message for your view? (OK = hide locally, Cancel to abort)")) return;

    try {
      // Try to hide for current user first (non-destructive)
      await axios.post(
        API + `/api/messages/${msgId}/hide`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );

      // remove locally from this user's UI
      setMessages((m) => m.filter((x) => x._id !== msgId));

      // tell server via socket (optionally) so server can notify other sockets if required
      if (socket && socket.connected) {
        socket.emit("message_hidden", { messageId: msgId, userId: user?._id || user?.id });
      }
    } catch (err: any) {
      // If hide endpoint is not available, fallback to server-side delete
      if (err?.response?.status === 404 || err?.response?.status === 405 || !err?.response) {
        try {
          await axios.delete(API + "/api/messages/" + msgId, {
            headers: { Authorization: "Bearer " + token },
          });
          setMessages((m) => m.filter((x) => x._id !== msgId));
          if (socket && socket.connected) {
            socket.emit("delete_message", { room: inDM && activeConversation ? activeConversation._id : room, messageId: msgId, userId: user?._id || user?.id });
          }
        } catch (err2) {
          console.error("delete fallback error", err2);
        }
      } else {
        console.error("hide message error", err);
      }
    }
  }

  // Date helpers & grouping
  function getDateLabel(dateString: string) {
    const date = dayjs(dateString);
    const today = dayjs();
    if (date.isSame(today, "day")) return "Today";
    if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
    return date.format("DD MMM YYYY");
  }
  function shouldShowAvatar(index: number) {
    const m = messages[index];
    if (!m) return true;
    if (index === 0) return true;
    const prev = messages[index - 1];
    if (!prev) return true;
    const sameSender = String(prev.sender?._id || prev.sender?.id) === String(m.sender?._id || m.sender?.id);
    const timeDiff = Math.abs(dayjs(m.createdAt).diff(dayjs(prev.createdAt), "minute"));
    return !(sameSender && timeDiff <= 5);
  }

  const unreadIndex = messages.findIndex((m) => {
    const readIds = (m.readBy || []).map((r: any) => String(r));
    const uid = String(user?._id || user?.id);
    return !readIds.includes(uid);
  });

  function jumpToUnread() {
    if (unreadRef.current) unreadRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Status updated callback (from StatusPicker)
  function onMyStatusUpdated(status: any) {
    if (!status) {
      setStatuses((s) => {
        const copy = { ...s };
        delete copy[String(user?._id || user?.id)];
        return copy;
      });
    } else {
      setStatuses((s) => ({ ...s, [String(status.user?._id || status.user)]: status }));
    }
  }

  // Open conversation (used by SearchUsers and ConversationsList and AllUsers)
  function openConversation(conv: any) {
    setActiveConversation(conv);
    setInDM(true);
    setView("chat");
    if (socket && socket.connected) socket.emit("join_room", conv._id || conv.room || conv.id);
  }
  function closeDM() {
    setActiveConversation(null);
    setInDM(false);
  }

  // Message renderer used by both rooms and DMs - parity achieved
  function renderMessages() {
    return messages.map((m, index) => {
      const currentDate = dayjs(m.createdAt).format("YYYY-MM-DD");
      const prevDate = index > 0 ? dayjs(messages[index - 1].createdAt).format("YYYY-MM-DD") : null;
      const showDateSeparator = currentDate !== prevDate;

      const showAvatar = shouldShowAvatar(index);
      const isUnread = unreadIndex >= 0 && index === unreadIndex;
      const senderId = String(m.sender?._id || m.sender?.id);
      const senderStatus = statuses[senderId];

      return (
        <Fragment key={m._id}>
          {showDateSeparator && (
            <div className="my-6 text-center">
              <span className="px-4 py-1 rounded-full card-date">{getDateLabel(m.createdAt)}</span>
            </div>
          )}

          {isUnread && (
            <div ref={unreadRef} className="my-2 flex justify-center">
              <span className="px-3 py-1 rounded-md bg-orange-500 text-white text-xs">Unread messages</span>
            </div>
          )}

          <div
            className={clsx("message flex gap-3 items-start", (m.sender?._id === user?._id) && "msg-mine")}
            style={{ transition: "opacity 280ms ease, transform 280ms ease", opacity: ready ? 1 : 0, transform: ready ? "translateY(0px)" : "translateY(6px)" }}
          >
            {showAvatar ? <img src={makeAvatarUrl(m.sender?.avatar)} className="avatar w-10 h-10 rounded-md object-cover" /> : <div style={{ width: 40 }} />}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                {showAvatar && <strong>{m.sender?.username}</strong>}
                <span className="text-xs opacity-60 cursor-default" title={dayjs(m.createdAt).format("dddd, DD MMM YYYY • HH:mm")}>
                  {dayjs(m.createdAt).format("HH:mm")}
                </span>
                {m.edited && <span className="text-xs opacity-50 ml-2">(edited)</span>}
                {senderStatus && (
                  <span className="ml-3 text-xs px-2 py-0.5 rounded-md card-status flex items-center gap-1">
                    <span>{senderStatus.emoji}</span>
                    <span className="opacity-80">{senderStatus.mood}</span>
                  </span>
                )}
              </div>

              {m.fileUrl && <img src={API + m.fileUrl} className="max-w-xs rounded-md mt-2" />}

              {editingMessageId === m._id ? (
                <div className="flex gap-2 mt-2">
                  <input className="input p-2 rounded-md flex-1" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                  <button className="btn px-3" onClick={() => saveEdit(m._id)}>Save</button>
                  <button className="px-3 py-2 border rounded-md" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className="mt-2">{m.text}</div>
              )}

              <div className="flex gap-2 mt-2 items-center text-sm">
                {["❤️", "🔥", "😂"].map((emoji) => (
                  <button key={emoji} className={clsx("px-2 py-1 rounded-full border", hasReacted(m, emoji) && "reacted")} onClick={() => toggleReaction(m, emoji)}>
                    {emoji} {reactionCount(m, emoji) || ""}
                  </button>
                ))}

                {String(m.sender?._id || m.sender?.id) === String(user?._id || user?.id) && (
                  <div className="ml-4 flex gap-2">
                    <button className="text-xs opacity-80" onClick={() => startEdit(m)}>Edit</button>
                    <button className="text-xs opacity-80" onClick={() => deleteMessage(m._id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      );
    });
  }

  // AUTH pages fallback
  if (!token || !user) {
    return authPage === "login" ? (
      <Login onSuccess={({ token, user }: any) => { setToken(token); setUser(user); }} switchToRegister={() => setAuthPage("register")} />
    ) : (
      <Register onSuccess={({ token, user }: any) => { setToken(token); setUser(user); }} switchToLogin={() => setAuthPage("login")} />
    );
  }

  // ---- RENDER ----
  return (
    <div className="layout container flex gap-4 p-4 min-h-screen">
      <aside className="sidebar">
        <div>
          {/* Sidebar header with theme toggle */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex flex-col items-center">
              <img src="/src/assets/logo.png" className="w-16 h-16 rounded-xl mb-2 object-cover" alt="logo" />
              <h2 className="text-xl font-bold">BANJA</h2>
            </div>

            <button
              className="p-2 rounded-lg border border-slate-600 hover:bg-slate-700/40 transition"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img src={makeAvatarUrl(user?.avatar)} className="w-14 h-14 rounded-md object-cover" />
            <div>
              <div className="font-bold">{user?.username}</div>
              <div className="text-sm opacity-70">{user?.email}</div>
              {myStatus && (
                <div className="text-xs mt-1">
                  <span className="mr-2">{myStatus.emoji}</span>
                  <span className="opacity-80">{myStatus.mood}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <StatusPicker token={token} currentStatus={myStatus} onUpdated={onMyStatusUpdated} />
          </div>

          <div className="mt-4">
            <label className="block text-sm mb-2">Change Profile</label>
            <input type="file" accept="image/*" onChange={uploadAvatarDirect} />
            {selectedAvatar && (
              <div className="flex gap-2 mt-2">
                <button className="btn" onClick={saveAvatar}>Save Profile</button>
=======
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
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
                <button className="px-3 py-2 border rounded-md" onClick={() => setSelectedAvatar(null)}>Cancel</button>
              </div>
            )}
          </div>

<<<<<<< HEAD
=======
          {/* Rooms */}
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Rooms</h4>
            <div className="flex flex-col gap-2">
              {rooms.map((r) => (
<<<<<<< HEAD
                <button key={r} className={clsx("text-left p-2 rounded-md", r === room && !inDM && "bg-slate-800/50")} onClick={() => { setRoom(r); setInDM(false); setView("chat"); }}>
=======
                <button
                  key={r}
                  className={clsx("text-left p-2 rounded-md", r === room && "bg-slate-800/50")}
                  onClick={() => setRoom(r)}
                >
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
                  #{r}
                </button>
              ))}
            </div>
          </div>
<<<<<<< HEAD

          <div className="mt-6">
            <ConversationsList token={token} onOpenConversation={(conv) => openConversation(conv)} currentUserId={user?._id} />
          </div>

          <div className="mt-4 px-2">
            <SearchUsers token={token} onOpenConversation={(conv) => openConversation(conv)} currentUserId={user?._id} />
          </div>

          <div className="mt-3 px-2">
            <button className="w-full text-left px-2 py-2 rounded-md hover:bg-slate-800/40" onClick={() => { setView("all-users"); setInDM(false); }}>
              All users
            </button>
          </div>
=======
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
        </div>

        <button className="btn w-full mt-6" onClick={logout}>Log Out</button>
      </aside>

<<<<<<< HEAD
      <main className="main flex-1 flex flex-col">
        {view === "all-users" ? (
          <AllUsers token={token} onOpenConversation={(conv) => openConversation(conv)} currentUserId={user?._id} />
        ) : (
          <>
            <header className="flex items-center justify-between mb-4">
              {inDM && activeConversation ? (
                <div className="flex items-center gap-3">
                  {(() => {
                    const partner = (activeConversation.participants || []).find((p: any) => String(p._id) !== String(user?._id));
                    return (
                      <>
                        <img src={makeAvatarUrl(partner?.avatar)} className="w-10 h-10 rounded-md object-cover" />
                        <div>
                          <div className="font-semibold">{partner?.username || "Direct Message"}</div>
                          <div className="text-xs opacity-70">Private conversation</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <h3 className="text-lg font-semibold">#{room}</h3>
              )}

              <div className="text-sm opacity-80 flex items-center gap-3">
                {Object.values(typingUsers).some(Boolean) ? "Someone is typing..." : ""}
                {unreadIndex >= 0 && <button className="text-xs px-3 py-1 bg-cyan-500 text-white rounded-full" onClick={jumpToUnread}>Jump to unread</button>}
              </div>
            </header>

            <section className="flex-1 overflow-auto p-2">
              <div className="flex flex-col gap-4">
                {renderMessages()}
                <div ref={messagesEndRef} />
              </div>
            </section>

            <form className="composer mt-4 flex items-center gap-2" onSubmit={sendMessage}>
              <input className="input flex-1 p-3 rounded-md" value={text} onChange={onComposerChange} placeholder={inDM ? "Message..." : "Say something..."} />
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button className="btn px-4 py-2" type="submit">Send</button>
            </form>
          </>
        )}
=======
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
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
      </main>
    </div>
  );
}
