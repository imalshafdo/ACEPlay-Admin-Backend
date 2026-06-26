import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  slug: { type: String, required: true, lowercase: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
  type: { type: String, enum: ['page', 'faq', 'announcement', 'other'], default: 'page' },
  countryGroup: { type: String, lowercase: true },
  meta: {
    description: String,
    keywords: [String],
  },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

contentSchema.index({ slug: 1, ownerId: 1 }, { unique: true });

const Content = mongoose.model('Content', contentSchema);
Content.collection.dropIndex('slug_1').catch(() => {});

export default Content;
