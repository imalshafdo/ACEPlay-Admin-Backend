import routeFactory from '../utils/routeFactory.js';
import {
  getGameLists,
  getGameListById,
  createGameList,
  updateGameList,
  deleteGameList,
} from '../controllers/gameListController.js';

export default routeFactory({
  getAll: getGameLists,
  getById: getGameListById,
  create: createGameList,
  update: updateGameList,
  remove: deleteGameList,
});
