import Banner from '../models/Banner.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getBanners,
  getById: getBannerById,
  create: createBanner,
  update: updateBanner,
  remove: deleteBanner,
} = createCrudHandlers(Banner, {
  resourceName: 'Banner',
  filterable: ['countryGroup', 'placement', 'status', 'siteKey'],
});
