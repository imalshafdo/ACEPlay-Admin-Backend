import routeFactory from '../utils/routeFactory.js';
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../controllers/promotionController.js';

export default routeFactory({
  getAll: getPromotions,
  getById: getPromotionById,
  create: createPromotion,
  update: updatePromotion,
  remove: deletePromotion,
});
