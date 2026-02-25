module.exports = (err, req, res, next) => {
  console.error(err);
  let status = err.status || 500;

  if (err.name === "ValidationError" || err.name === "CastError") {
    status = 400;
  }

  if (err.message === "Only PDF files allowed") {
    status = 400;
  }

  res.status(status).json({
    message: err.message || "Server error"
  });
};
