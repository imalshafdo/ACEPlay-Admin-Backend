import NavItem from '../models/NavItem.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getNavItems,
  getById: getNavItemById,
  create: createNavItem,
  update: updateNavItem,
  remove: deleteNavItem,
} = createCrudHandlers(NavItem, {
  resourceName: 'Navigation item',
  filterable: ['countryGroup', 'status', 'key', 'siteKey'],
});
