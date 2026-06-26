import mongoose from 'mongoose';
import SiteSettings from '../models/SiteSettings.js';
import Casino from '../models/Casino.js';
import Admin from '../models/Admin.js';
import asyncHandler from '../utils/asyncHandler.js';

const DEFAULT_KEY = 'default';

export const getSiteSettings = asyncHandler(async (req, res) => {
  const siteKey = req.user.role === 'superadmin' ? DEFAULT_KEY : req.user.id;
  let settings = await SiteSettings.findOne({ siteKey });
  if (!settings) {
    settings = await SiteSettings.create({ 
      siteKey, 
      ownerId: req.user.id,
      siteName: req.user.role === 'superadmin' ? 'LUK666' : 'My Casino Brand'
    });
  }
  res.json({ success: true, data: settings });
});

export const updateSiteSettings = asyncHandler(async (req, res) => {
  const siteKey = req.user.role === 'superadmin' ? DEFAULT_KEY : req.user.id;
  const payload = { ...req.body };
  delete payload._id;
  delete payload.siteKey;

  if (req.user.role !== 'superadmin') {
    payload.ownerId = req.user.id;
  }

  const settings = await SiteSettings.findOneAndUpdate(
    { siteKey },
    payload,
    { new: true, upsert: true, runValidators: true }
  );

  if (settings.ownerId) {
    const updatePayload = { siteKey: settings.siteKey };
    if (payload.siteName) updatePayload.name = payload.siteName;
    if (payload.status) updatePayload.status = payload.status;
    if (payload.countryGroup) updatePayload.countryGroup = payload.countryGroup;
    
    const existingCasino = settings.siteKey 
      ? await Casino.findOne({ siteKey: settings.siteKey })
      : await Casino.findOne({ ownerId: settings.ownerId });
    if (!existingCasino) {
      await Casino.create({
        name: settings.siteName || payload.siteName || 'New Casino Brand',
        ownerId: settings.ownerId,
        siteKey: settings.siteKey,
        countryGroup: settings.countryGroup || payload.countryGroup || 'thailand',
        status: settings.status || payload.status || 'draft',
        currency: '฿',
        launchYear: settings.launchYear || '2026',
        description: settings.tagline || '',
      });
    } else {
      await Casino.updateOne({ _id: existingCasino._id }, { $set: updatePayload });
    }
  }

  res.json({ success: true, data: settings });
});

export const listSiteSettings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role !== 'superadmin') {
    filter.ownerId = req.user.id;
  } else {
    if (req.query.ownerId) {
      filter.ownerId = req.query.ownerId;
    } else {
      const clients = await Admin.find({ role: { $ne: 'superadmin' } });
      const clientIds = clients.map(c => c._id);
      filter.ownerId = { $in: clientIds };
      filter.siteName = { $nin: ['New Casino Brand', 'My Casino Brand', 'LUK666'] };
    }
  }
  const settings = await SiteSettings.find(filter);
  res.json({ success: true, data: settings });
});

export const getSiteSettingsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const settings = await SiteSettings.findById(id);
  if (!settings) {
    return res.status(404).json({ success: false, message: 'Settings not found' });
  }
  if (req.user.role !== 'superadmin' && settings.ownerId?.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }
  res.json({ success: true, data: settings });
});

export const updateSiteSettingsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await SiteSettings.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Settings not found' });
  }
  if (req.user.role !== 'superadmin' && existing.ownerId?.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  const payload = { ...req.body };
  delete payload._id;
  delete payload.siteKey;

  const settings = await SiteSettings.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  if (settings.ownerId) {
    const updatePayload = { siteKey: settings.siteKey };
    if (payload.siteName) updatePayload.name = payload.siteName;
    if (payload.status) updatePayload.status = payload.status;
    if (payload.countryGroup) updatePayload.countryGroup = payload.countryGroup;
    
    const existingCasino = settings.siteKey 
      ? await Casino.findOne({ siteKey: settings.siteKey })
      : await Casino.findOne({ ownerId: settings.ownerId });
    if (!existingCasino) {
      await Casino.create({
        name: settings.siteName || payload.siteName || 'New Casino Brand',
        ownerId: settings.ownerId,
        siteKey: settings.siteKey,
        countryGroup: settings.countryGroup || payload.countryGroup || 'thailand',
        status: settings.status || payload.status || 'draft',
        currency: '฿',
        launchYear: settings.launchYear || '2026',
        description: settings.tagline || '',
      });
    } else {
      await Casino.updateOne({ _id: existingCasino._id }, { $set: updatePayload });
    }
  }

  res.json({ success: true, data: settings });
});

export const deleteSiteSettings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const settings = await SiteSettings.findById(id);
  if (!settings) {
    return res.status(404).json({ success: false, message: 'Settings not found' });
  }
  if (req.user.role !== 'superadmin' && settings.ownerId?.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
  }

  await SiteSettings.findByIdAndDelete(id);

  if (settings.siteKey) {
    await Casino.deleteMany({ siteKey: settings.siteKey });
  } else if (settings.ownerId) {
    await Casino.deleteMany({ ownerId: settings.ownerId });
  }

  res.json({ success: true, message: 'Site settings deleted successfully' });
});

export const createSiteSettings = asyncHandler(async (req, res) => {
  const targetOwnerId = req.user.role === 'superadmin'
    ? (req.body.ownerId ? new mongoose.Types.ObjectId(req.body.ownerId) : new mongoose.Types.ObjectId())
    : req.user.id;
  
  const payload = {
    siteKey: new mongoose.Types.ObjectId().toString(),
    ownerId: targetOwnerId,
    siteName: req.body.siteName || 'New Casino Brand',
    launchYear: req.body.launchYear || '2026',
    depositMin: req.body.depositMin || '100 THB',
    depositMax: req.body.depositMax || '100,000 THB',
    tagline: req.body.tagline || 'Best Online Casino Experience',
    features: req.body.features || [
      'Direct automatic deposit-withdrawal system',
      'Supports all platforms, play anytime, anywhere',
      '24-hour customer care support'
    ],
    status: 'draft',
    countryGroup: req.body.countryGroup || 'thailand',
  };
  
  const settings = await SiteSettings.create(payload);

  await Casino.create({
    name: payload.siteName,
    ownerId: targetOwnerId,
    siteKey: payload.siteKey,
    countryGroup: payload.countryGroup,
    status: payload.status,
    currency: '฿',
    launchYear: payload.launchYear,
    description: payload.tagline,
  });

  res.status(201).json({ success: true, data: settings });
});


