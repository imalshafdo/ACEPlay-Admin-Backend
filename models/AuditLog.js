import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true, lowercase: true },
  action: {
    type: String,
    required: true,
    enum: ['UPDATE_REQUEST', 'APPROVED', 'REJECTED'],
  },
  brandName: { type: String, required: true },
  fieldChanged: { type: String, required: true },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ brandName: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
