require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB ✅');
  const result = await User.deleteMany({ password: { $exists: false } });
  console.log(`Deleted ${result.deletedCount} old users missing passwords.`);
  mongoose.disconnect();
});
