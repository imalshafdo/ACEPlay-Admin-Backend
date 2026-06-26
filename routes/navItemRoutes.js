import routeFactory from '../utils/routeFactory.js';
import {
  getNavItems,
  getNavItemById,
  createNavItem,
  updateNavItem,
  deleteNavItem,
} from '../controllers/navItemController.js';

export default routeFactory({
  getAll: getNavItems,
  getById: getNavItemById,
  create: createNavItem,
  update: updateNavItem,
  remove: deleteNavItem,
});
