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
