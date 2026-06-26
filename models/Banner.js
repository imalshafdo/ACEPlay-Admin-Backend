import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, required: true },
  link: { type: String, default: '' },
  offerText: { type: String, default: '' },
  buttonText: { type: String, default: 'Participate in the promotion' },
  deposit: { type: String, default: '' },
  bonus: { type: String, default: '' },
  getAmount: { type: String, default: '' },
  turnover: { type: String, default: '' },
  withdraw: { type: String, default: '' },
  placement: { type: String, default: 'hero', enum: ['hero', 'exclusive', 'sidebar', 'other'] },
  countryGroup: { type: String, lowercase: true },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  startsAt: { type: Date },
  endsAt: { type: Date },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  siteKey: { type: String },
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
