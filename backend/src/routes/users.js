<<<<<<< HEAD
// backend/routes/users.js
=======
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
<<<<<<< HEAD

=======
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
<<<<<<< HEAD

const uploadDir = path.join(
  __dirname,
  '..',
  '..',
  process.env.UPLOAD_DIR || 'uploads'
);
=======
const uploadDir = path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads');
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
<<<<<<< HEAD
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
=======
    cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + ext);
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
  }
});
const upload = multer({ storage });

const router = express.Router();

<<<<<<< HEAD
/* ---------------------------------------------
   UPDATE AVATAR 
----------------------------------------------*/
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: 'No file uploaded' });

    const filePath = path.join(uploadDir, req.file.filename);
    const outPath = filePath + '-resized.jpg';

    await sharp(filePath)
      .resize({ width: 800 })
      .jpeg({ quality: 80 })
      .toFile(outPath);

    try {
      fs.unlinkSync(filePath);
    } catch (e) {}

    const finalName = '/uploads/' + path.basename(outPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: finalName },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (err) {
    console.error('[users/avatar]', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------------------------------
   SEARCH USERS  (/api/users/search?q=value)
----------------------------------------------*/
router.get('/search', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const users = await User.find({
      $or: [{ username: re }, { email: re }]
    })
      .select('username email avatar')
      .limit(30);

    res.json(users);
  } catch (err) {
    console.error('[users/search]', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ---------------------------------------------
   GET ALL USERS  (/api/users)
----------------------------------------------*/
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('username email avatar');
    res.json(users);
  } catch (err) {
    console.error('[users/getAll]', err);
    res.status(500).json({ message: 'Server error' });
=======
router.post('/avatar', auth, upload.single('avatar'), async (req,res)=>{
  try{
    if(!req.file) return res.status(400).json({ success:false, message:'No file uploaded' });
    const filePath = path.join(uploadDir, req.file.filename);
    const outPath = filePath + '-resized.jpg';
    await sharp(filePath).resize({ width: 800 }).jpeg({ quality: 80 }).toFile(outPath);
    try { fs.unlinkSync(filePath); } catch(e){}
    const finalName = '/uploads/' + path.basename(outPath);
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: finalName }, { new: true }).select('-password');
    res.json({ success: true, user });
  }catch(err){
    console.error('[users/avatar] ', err);
    res.status(500).json({ success:false, message: err.message });
>>>>>>> 5a5c0340e2005655c4949034d4fe94fbb3c422b2
  }
});

export default router;
