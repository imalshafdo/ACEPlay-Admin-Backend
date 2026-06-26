import Content from '../models/Content.js';
import { createCrudHandlers } from '../utils/crudFactory.js';

export const {
  getAll: getContents,
  getById: getContentById,
  create: createContent,
  update: updateContent,
  remove: deleteContent,
} = createCrudHandlers(Content, {
  resourceName: 'Content',
  filterable: ['countryGroup', 'type', 'status'],
});
