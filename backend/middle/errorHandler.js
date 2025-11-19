// backend/middleware/errorHandler.js
export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Not Found - ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Server Error" });
};
