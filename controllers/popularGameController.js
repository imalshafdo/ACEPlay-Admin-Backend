import PopularGame from '../models/PopularGame.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getPopularGames,
  getById: getPopularGameById,
  create: createPopularGame,
  update: updatePopularGame,
  remove: deletePopularGame,
} = createCrudHandlers(PopularGame, {
  resourceName: 'Popular game',
  filterable: ['countryGroup', 'status', 'siteKey'],
});
