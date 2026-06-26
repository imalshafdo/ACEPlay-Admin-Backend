import mongoose from 'mongoose';

const bigWinSchema = new mongoose.Schema({
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  gameName: { type: String, required: true },
  provider: { type: String, default: '' },
  thumbnailImage: { type: String, default: '' },
  betAmount: { type: String, default: '' },
  winnings: { type: String, default: '' },
  multiplier: { type: String, default: '' },
  playUrl: { type: String, default: '' },
  countryGroup: { type: String, lowercase: true },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  siteKey: { type: String },
}, { timestamps: true });

export default mongoose.model('BigWin', bigWinSchema);
