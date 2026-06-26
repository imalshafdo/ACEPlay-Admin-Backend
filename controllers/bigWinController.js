import BigWin from '../models/BigWin.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getBigWins,
  getById: getBigWinById,
  create: createBigWin,
  update: updateBigWin,
  remove: deleteBigWin,
} = createCrudHandlers(BigWin, {
  resourceName: 'Big win',
  filterable: ['countryGroup', 'status', 'siteKey'],
});
