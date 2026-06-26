import express from 'express';
import routeFactory from '../utils/routeFactory.js';
import {
  getGameTypeConfigs,
  getGameTypeConfigById,
  createGameTypeConfig,
  updateGameTypeConfig,
  deleteGameTypeConfig,
  upsertGameTypeConfig,
} from '../controllers/gameTypeConfigController.js';

const router = express.Router();

router.post('/upsert', upsertGameTypeConfig);
router.use('/', routeFactory({
  getAll: getGameTypeConfigs,
  getById: getGameTypeConfigById,
  create: createGameTypeConfig,
  update: updateGameTypeConfig,
  remove: deleteGameTypeConfig,
}));

export default router;
