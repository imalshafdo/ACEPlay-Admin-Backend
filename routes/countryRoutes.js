import routeFactory from '../utils/routeFactory.js';
import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/countryController.js';

export default routeFactory({
  getAll: getCountries,
  getById: getCountryById,
  create: createCountry,
  update: updateCountry,
  remove: deleteCountry,
});
