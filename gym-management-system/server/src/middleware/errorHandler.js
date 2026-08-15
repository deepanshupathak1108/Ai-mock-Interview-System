const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((entry) => entry.message);
    return res.status(400).json({ message: errors[0] || "Validation failed", errors });
  }

  if (err.code === 11000) {
    const duplicatedField = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `${duplicatedField} already exists` });
  }

  return res.status(statusCode).json({
    message: err.message || "Something went wrong",
  });
};

export default errorHandler;
