import asyncHandler from './asyncHandler.js';

const parseFilters = (query, allowedFilters = []) => {
  const filters = {};
  for (const key of allowedFilters) {
    if (query[key] !== undefined && query[key] !== '') {
      filters[key] = query[key];
    }
  }
  return filters;
};

export const createCrudHandlers = (Model, options = {}) => {
  const {
    resourceName = 'Resource',
    filterable = [],
    defaultSort = { createdAt: -1 },
    publishedFilter = null,
  } = options;

  const getOwnerFilter = (req) => {
    if (req.user && req.user.role !== 'superadmin' && Model.schema.paths.ownerId) {
      return { ownerId: req.user.id };
    }
    return {};
  };

  const getAll = asyncHandler(async (req, res) => {
    const filters = parseFilters(req.query, filterable);
    if (publishedFilter) Object.assign(filters, publishedFilter);
    Object.assign(filters, getOwnerFilter(req));

    if (req.query.ownerId && Model.schema.paths.ownerId && !filters.ownerId) {
      filters.ownerId = req.query.ownerId;
    }

    const items = await Model.find(filters).sort(defaultSort);
    res.status(200).json({ success: true, count: items.length, data: items });
  });

  const getById = asyncHandler(async (req, res) => {
    const filters = { _id: req.params.id, ...getOwnerFilter(req) };
    if (publishedFilter) Object.assign(filters, publishedFilter);

    const item = await Model.findOne(filters);
    if (!item) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }
    res.status(200).json({ success: true, data: item });
  });

  const create = asyncHandler(async (req, res) => {
    const payload = { ...req.body };
    if (req.user && Model.schema.paths.ownerId) {
      if (!payload.ownerId) {
        payload.ownerId = req.user.id;
      }
    }
    if (Model.schema.paths.siteKey && !payload.siteKey) {
      if (req.query.siteKey) {
        payload.siteKey = req.query.siteKey;
      }
    }
    const item = await Model.create(payload);
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req, res) => {
    const query = { _id: req.params.id, ...getOwnerFilter(req) };
    const item = await Model.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }
    res.status(200).json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req, res) => {
    const query = { _id: req.params.id, ...getOwnerFilter(req) };
    const item = await Model.findOneAndDelete(query);
    if (!item) {
      return res.status(404).json({ success: false, message: `${resourceName} not found` });
    }
    res.status(200).json({ success: true, message: `${resourceName} deleted successfully` });
  });

  return { getAll, getById, create, update, remove };
};
