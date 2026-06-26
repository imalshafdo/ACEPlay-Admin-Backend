import mongoose from 'mongoose';

const gameTypeConfigSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. "slot", "cockFighting"
  title: { type: String, required: true },
  emoji: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

gameTypeConfigSchema.index({ key: 1, ownerId: 1 }, { unique: true });

const GameTypeConfig = mongoose.model('GameTypeConfig', gameTypeConfigSchema);
GameTypeConfig.collection.dropIndex('key_1').catch(() => {});

export default GameTypeConfig;