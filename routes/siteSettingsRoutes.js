import express from 'express';
import { 
  getSiteSettings, 
  updateSiteSettings, 
  listSiteSettings,
  getSiteSettingsById,
  updateSiteSettingsById,
  deleteSiteSettings,
  createSiteSettings
} from '../controllers/siteSettingsController.js';

const router = express.Router();

router.route('/all').get(listSiteSettings);
router.route('/').get(getSiteSettings).put(updateSiteSettings).post(createSiteSettings);
router.route('/:id')
  .get(getSiteSettingsById)
  .put(updateSiteSettingsById)
  .delete(deleteSiteSettings);

export default router;
