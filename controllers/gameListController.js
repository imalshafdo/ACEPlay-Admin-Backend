import GameList from '../models/GameList.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getGameLists,
  getById: getGameListById,
  create: createGameList,
  update: updateGameList,
  remove: deleteGameList,
} = createCrudHandlers(GameList, {
  resourceName: 'Game',
  filterable: ['countryGroup', 'gameType', 'status', 'featured'],
});
