import mongoose from 'mongoose';

const gameListSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
  gamePlatform: { type: String, default: '' },
  gameType: { type: String, required: true },
  rtp: { type: Number },
  image: { type: String, default: '' },
  url: { type: String, default: '' },
  countryGroup: { type: String, lowercase: true },
  featured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

export default mongoose.model('GameList', gameListSchema);
