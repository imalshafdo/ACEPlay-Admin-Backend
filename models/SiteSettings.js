import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  siteKey: { type: String, default: 'default' },
  siteName: { type: String, default: 'LUK666' },
  launchYear: { type: String, default: '2018' },
  depositMin: { type: String, default: '1 THB' },
  depositMax: { type: String, default: '100,000 THB' },
  tagline: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  endorsementLogos: [{ type: String }],
  features: [{ type: String }],
  playNowUrl: { type: String, default: '' },
  playNowLabel: { type: String, default: 'Play Now' },
  alternateLinksUrl: { type: String, default: '' },
  alternateLinksLabel: { type: String, default: 'Alternate links' },
  viewPromotionsUrl: { type: String, default: '' },
  viewPromotionsLabel: { type: String, default: 'View All Promotions' },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  countryGroup: { type: String, lowercase: true, default: 'thailand' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

siteSettingsSchema.index({ siteKey: 1, ownerId: 1 }, { unique: true });

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
SiteSettings.collection.dropIndex('siteKey_1').catch(() => {});

export default SiteSettings;
