import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tag: { type: String, default: '' },
  image: { type: String, default: '' },
  deposit: { type: String, default: '' },
  bonus: { type: String, default: '' },
  turnover: { type: String, default: '' },
  netwin: { type: String, default: '' },
  gameTypes: [{ type: String }],
  gameType: { type: String, default: '' },
  primaryBtnLabel: { type: String, default: '' },
  primaryBtnUrl: { type: String, default: '' },
  secondaryBtnLabel: { type: String, default: '' },
  secondaryBtnUrl: { type: String, default: '' },
  maxWithdrawal: { type: String, default: '' },
  availability: { type: String, default: '' },
  url: { type: String, default: '' },
  casino: { type: mongoose.Schema.Types.ObjectId, ref: 'Casino' },
  countryGroup: { type: String, lowercase: true },
  sortOrder: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  siteKey: { type: String },
}, { timestamps: true });

export default mongoose.model('Promotion', promotionSchema);
