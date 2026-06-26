import routeFactory from '../utils/routeFactory.js';
import {
  getPopularGames,
  getPopularGameById,
  createPopularGame,
  updatePopularGame,
  deletePopularGame,
} from '../controllers/popularGameController.js';

export default routeFactory({
  getAll: getPopularGames,
  getById: getPopularGameById,
  create: createPopularGame,
  update: updatePopularGame,
  remove: deletePopularGame,
});
