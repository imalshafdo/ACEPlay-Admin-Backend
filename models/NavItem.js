import mongoose from 'mongoose';

const navItemSchema = new mongoose.Schema({
  key: { type: String },
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  iconUrl: { type: String, default: '' },
  url: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  countryGroup: { type: String, lowercase: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  siteKey: { type: String },
}, { timestamps: true });

navItemSchema.pre('save', function(next) {
  if (!this.key && this.label) {
    this.key = this.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const NavItem = mongoose.model('NavItem', navItemSchema);

// Drop unique index on key + countryGroup to prevent duplicate key errors since countryGroup is removed
NavItem.collection.dropIndex('key_1_countryGroup_1').catch(() => {});

export default NavItem;
