function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `এই API পাওয়া যায়নি: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "তথ্যে সমস্যা আছে।",
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "এই তথ্যটি আগে থেকেই ব্যবহার করা হয়েছে।"
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "সার্ভারে সমস্যা হয়েছে।"
  });
}

module.exports = { notFound, errorHandler };
