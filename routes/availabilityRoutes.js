import routeFactory from '../utils/routeFactory.js';
import {
  getAvailabilities,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
} from '../controllers/availabilityController.js';

export default routeFactory({
  getAll: getAvailabilities,
  getById: getAvailabilityById,
  create: createAvailability,
  update: updateAvailability,
  remove: deleteAvailability,
});
