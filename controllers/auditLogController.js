import AuditLog from '../models/AuditLog.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 });
  res.json({ success: true, count: logs.length, data: logs });
});
