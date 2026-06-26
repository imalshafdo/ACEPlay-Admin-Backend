export const requireSuperadmin = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden — superadmin access required',
    });
  }
  next();
};
