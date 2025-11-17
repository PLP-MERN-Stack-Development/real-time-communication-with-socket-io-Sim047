import express from 'express';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:room', auth, async (req,res)=>{
  try{
    const { room } = req.params;
    const msgs = await Message.find({ room }).populate('sender','username avatar').populate('replyTo').populate('readBy','username').sort({ createdAt: 1 }).limit(1000);
    res.json(msgs);
  }catch(err){
    console.error('[messages/get] ', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req,res)=>{
  try{
    const msg = await Message.findById(req.params.id);
    if(!msg) return res.status(404).json({ message: 'Not found' });
    if(String(msg.sender) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await msg.remove();
    res.json({ message: 'deleted' });
  }catch(err){
    console.error('[messages/delete] ', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req,res)=>{
  try{
    const { text } = req.body;
    const msg = await Message.findById(req.params.id);
    if(!msg) return res.status(404).json({ message: 'Not found' });
    if(String(msg.sender) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
    msg.text = text; msg.edited = true; await msg.save();
    const populated = await Message.findById(msg._id).populate('sender','username avatar').populate('replyTo').populate('readBy','username');
    res.json(populated);
  }catch(err){
    console.error('[messages/put] ', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
