import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 👈 Full name
  username: { type: String, required: true, unique: true }, // 👈 Unique login name
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);