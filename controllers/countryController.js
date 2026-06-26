import Country from '../models/Country.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getCountries,
  getById: getCountryById,
  create: createCountry,
  update: updateCountry,
  remove: deleteCountry,
} = createCrudHandlers(Country, {
  resourceName: 'Country',
  filterable: ['code', 'status'],
});
