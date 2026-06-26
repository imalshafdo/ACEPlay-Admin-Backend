import routeFactory from '../utils/routeFactory.js';
import {
  getBigWins,
  getBigWinById,
  createBigWin,
  updateBigWin,
  deleteBigWin,
} from '../controllers/bigWinController.js';

export default routeFactory({
  getAll: getBigWins,
  getById: getBigWinById,
  create: createBigWin,
  update: updateBigWin,
  remove: deleteBigWin,
});
