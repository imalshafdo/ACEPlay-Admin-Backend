import CasinoAvailability from '../models/CasinoAvailability.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getAvailabilities,
  getById: getAvailabilityById,
  create: createAvailability,
  update: updateAvailability,
  remove: deleteAvailability,
} = createCrudHandlers(CasinoAvailability, {
  resourceName: 'Casino availability',
  filterable: ['code', 'status'],
});
