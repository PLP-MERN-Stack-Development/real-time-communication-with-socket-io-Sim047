<<<<<<< HEAD
// backend/src/models/Message.js
import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    emoji: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: String, required: true }, // could be room name or conversation id
    text: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    reactions: [ReactionSchema],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // NEW: hide messages for particular users (per-user "deleted" or "cleared")
    hiddenFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
=======
import mongoose from 'mongoose';

const ReactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emoji: String
}, {_id: false});

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  room: String,
  fileUrl: String,
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  edited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  reactions: [ReactionSchema]
});

MessageSchema.set('toJSON', { virtuals: true });
MessageSchema.virtual('id').get(function(){ return this._id.toString(); });

export default mongoose.model('Message', MessageSchema);
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
