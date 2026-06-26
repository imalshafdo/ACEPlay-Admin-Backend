import mongoose from 'mongoose';

const popularGameSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  gamePlatform: { type: String, default: '' },
  image: { type: String, default: '' },
  winRate: { type: Number },
  maxWinnings: { type: String },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  betAmount: { type: String, default: '' },
  winAmount: { type: String, default: '' },
  multiplier: { type: String, default: '' },
  playUrl: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  countryGroup: { type: String, lowercase: true },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  siteKey: { type: String },
}, { timestamps: true });

export default mongoose.model('PopularGame', popularGameSchema);
