import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

countrySchema.index({ code: 1, ownerId: 1 }, { unique: true });

const Country = mongoose.model('Country', countrySchema);
Country.collection.dropIndex('code_1').catch(() => {});

export default Country;