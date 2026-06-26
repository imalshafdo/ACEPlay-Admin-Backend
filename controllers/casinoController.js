import Casino from '../models/Casino.js';
import { createCrudHandlers } from '../utils/crudFactory.js';
import asyncHandler from '../utils/asyncHandler.js';
import { writeCasinoAuditLogs } from '../utils/auditLogger.js';

export const {
  getAll: getCasinos,
  getById: getCasinoById,
  create: createCasino,
  remove: deleteCasino,
} = createCrudHandlers(Casino, {
  resourceName: 'Casino',
  filterable: ['countryGroup', 'tier', 'network', 'status'],
});

export const getMyCasinos = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'superadmin' ? {} : { ownerId: req.user.id };
  const casinos = await Casino.find(filter);
  res.json({ success: true, data: casinos });
});

export const updateCasino = asyncHandler(async (req, res) => {
  const existing = await Casino.findById(req.params.id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Casino not found' });
  }

  if ((!existing.ownerId || existing.ownerId.toString() !== req.user.id) && req.user.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own casinos' });
  }

  const casino = await Casino.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await writeCasinoAuditLogs({
    adminEmail: req.admin.email,
    brandName: casino.name,
    oldDoc: existing,
    newBody: req.body,
    action: 'APPROVED',
  });

  res.json({ success: true, data: casino });
});
