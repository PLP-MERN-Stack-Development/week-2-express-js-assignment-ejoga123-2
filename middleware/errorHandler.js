const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");

module.exports = (err, req, res, next) => {
  console.error(err);
  if (err instanceof NotFoundError || err instanceof ValidationError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
