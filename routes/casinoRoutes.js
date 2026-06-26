import express from 'express';
import routeFactory from '../utils/routeFactory.js';
import {
  getCasinos,
  getCasinoById,
  createCasino,
  updateCasino,
  deleteCasino,
  getMyCasinos,
} from '../controllers/casinoController.js';

const router = express.Router();

router.get('/my-casinos', getMyCasinos);

const crudRouter = routeFactory({
  getAll: getCasinos,
  getById: getCasinoById,
  create: createCasino,
  update: updateCasino,
  remove: deleteCasino,
});

router.use('/', crudRouter);

export default router;