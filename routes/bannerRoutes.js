import routeFactory from '../utils/routeFactory.js';
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';

export default routeFactory({
  getAll: getBanners,
  getById: getBannerById,
  create: createBanner,
  update: updateBanner,
  remove: deleteBanner,
});
