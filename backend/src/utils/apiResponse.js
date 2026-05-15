const apiSuccess = (res, data, status = 200) =>
  res.status(status).json({ success: true, data });

const apiError = (res, message, status = 400, code) =>
  res.status(status).json({
    success: false,
    error: code ? { message, code } : { message },
  });

module.exports = { apiSuccess, apiError };
