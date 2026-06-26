import express from 'express';

const routeFactory = (handlers) => {
  const router = express.Router();
  router.route('/').get(handlers.getAll).post(handlers.create);
  router.route('/:id').get(handlers.getById).put(handlers.update).delete(handlers.remove);
  return router;
};

export default routeFactory;
