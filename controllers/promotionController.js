import Promotion from '../models/Promotion.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getPromotions,
  getById: getPromotionById,
  create: createPromotion,
  update: updatePromotion,
  remove: deletePromotion,
} = createCrudHandlers(Promotion, {
  resourceName: 'Promotion',
  filterable: ['countryGroup', 'status', 'casino', 'siteKey'],
});
