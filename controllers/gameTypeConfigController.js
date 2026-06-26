import GameTypeConfig from '../models/GameTypeConfig.js';
import { createCrudHandlers } from '../utils/crudFactory.js';
import asyncHandler from '../utils/asyncHandler.js';

export const {
  getAll: getGameTypeConfigs,
  getById: getGameTypeConfigById,
  create: createGameTypeConfig,
  update: updateGameTypeConfig,
  remove: deleteGameTypeConfig,
} = createCrudHandlers(GameTypeConfig, {
  resourceName: 'Game type config',
  filterable: ['key', 'status'],
});

export const upsertGameTypeConfig = asyncHandler(async (req, res) => {
  const { key, title, emoji, status } = req.body;
  const config = await GameTypeConfig.findOneAndUpdate(
    { key },
    { title, emoji, status: status ?? 'published' },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(200).json({ success: true, data: config });
});
