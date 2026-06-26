import mongoose from 'mongoose';

const casinoAvailabilitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  path: { type: String, required: true },
  code: { type: String, required: true, lowercase: true },
  img: { type: String },
  payment: [String], // Array of Payment Image Gateway links
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

casinoAvailabilitySchema.index({ code: 1, ownerId: 1 }, { unique: true });

const CasinoAvailability = mongoose.model('CasinoAvailability', casinoAvailabilitySchema);
CasinoAvailability.collection.dropIndex('code_1').catch(() => {});

export default CasinoAvailability;