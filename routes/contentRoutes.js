import routeFactory from '../utils/routeFactory.js';
import {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
} from '../controllers/contentController.js';

export default routeFactory({
  getAll: getContents,
  getById: getContentById,
  create: createContent,
  update: updateContent,
  remove: deleteContent,
});
